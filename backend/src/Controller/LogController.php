<?php

declare(strict_types=1);

namespace LogMonitor\Backend\Controller;

use LogMonitor\Backend\Repository\LogRepository;
use LogMonitor\Backend\Service\LogService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Respect\Validation\Exceptions\NestedValidationException;
use Respect\Validation\Validator as v;

final class LogController
{
    public function __construct(
        private LogService $logService,
        private LogRepository $logRepository,
    ) {
    }

    public function index(Request $request, Response $response): Response
    {
        $logs = $this->logService->getLogFiles();
        $response->getBody()->write(\json_encode($logs));

        return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    }

    public function store(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();

        $isBulk = isset($data[0]) && \is_array($data[0]);
        $items  = $isBulk ? $data : [$data];

        $errors    = [];
        $seenPaths = [];

        foreach ($items as $index => $item) {
            try {
                v::arrayType()
                    ->key('title', v::optional(v::stringType()))
                    ->key('file_name', v::stringType()->notEmpty())
                    ->key('file_path', v::stringType()->notEmpty())
                    ->assert($item);
            } catch (NestedValidationException $e) {
                $errors[$index] = $e->getMessages();
            }

            if (isset($item['file_path'])) {
                if (!\file_exists($item['file_path'])) {
                    $errors[$index][] = 'File does not exist at the specified path';
                }

                if (\in_array($item['file_path'], $seenPaths, true)) {
                    $errors[$index][] = 'Duplicate file path in request';
                } else {
                    $seenPaths[] = $item['file_path'];
                }

                if ($this->logRepository->filePathExists($item['file_path'])) {
                    $errors[$index][] = 'File path already exists';
                }
            }
        }

        if (!empty($errors)) {
            $response->getBody()->write(\json_encode([
                'error'    => 'Validation failed',
                'messages' => (object) $errors,
            ]));

            return $response->withHeader('Content-Type', 'application/json')->withStatus(422);
        }

        $createdLogs = $this->logService->addLogFiles($items);

        $response->getBody()->write(\json_encode([
            'message' => 'Logs added successfully',
            'logs'    => $isBulk ? $createdLogs : $createdLogs[0],
        ]));

        return $response->withHeader('Content-Type', 'application/json')->withStatus(201);
    }

    public function sync(Request $request, Response $response): Response
    {
        $this->logService->syncLogs();
        $response->getBody()->write(\json_encode(['message' => 'Logs synchronized successfully']));

        return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    }

    public function show(Request $request, Response $response, string $logId): Response
    {
        $log = $this->logService->getLogInfo($logId);

        if (null === $log) {
            $response->getBody()->write(\json_encode(['error' => 'Log not found']));

            return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
        }

        $response->getBody()->write(\json_encode($log));

        return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    }

    public function getContent(Request $request, Response $response, string $logId): Response
    {
        $queryParams = $request->getQueryParams();
        $offset      = isset($queryParams['offset']) ? (int) $queryParams['offset'] : null;

        $result = $this->logService->getLogContent($logId, $offset);

        if (null === $result) {
            $response->getBody()->write(\json_encode(['error' => 'Log not found']));

            return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
        }

        $response->getBody()->write(\json_encode($result));

        return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    }

    public function update(Request $request, Response $response, string $logId): Response
    {
        $data  = $request->getParsedBody();

        try {
            v::arrayType()
                ->key('title', v::optional(v::stringType()))
                ->key('file_name', v::stringType()->notEmpty())
                ->key('file_path', v::stringType()->notEmpty())
                ->assert($data);
        } catch (NestedValidationException $e) {
            $response->getBody()->write(\json_encode([
                'error'    => 'Validation failed',
                'messages' => $e->getMessages(),
            ]));

            return $response->withHeader('Content-Type', 'application/json')->withStatus(422);
        }

        $this->logService->updateLogInfo($logId, $data);

        $response->getBody()->write(\json_encode(['message' => 'Log info updated successfully']));

        return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    }
}
