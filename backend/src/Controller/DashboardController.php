<?php

declare(strict_types=1);

namespace LogMonitor\Backend\Controller;

use LogMonitor\Backend\Service\DashboardService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class DashboardController
{
    public function __construct(private DashboardService $dashboardService)
    {
    }

    public function index(Response $response, Request $request): Response
    {
        $dashboardData = $this->dashboardService->getSlotsWithLogs();
        $response->getBody()->write(\json_encode($dashboardData));

        return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    }

    public function titles(Response $response, Request $request): Response
    {
        $titles = $this->dashboardService->getAllTitles();
        $response->getBody()->write(\json_encode($titles));

        return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    }

    public function assignSlot(Response $response, Request $request, array $args): Response
    {
        $data  = $request->getParsedBody();

        if (empty($data['title'])) {
            $response->getBody()->write(\json_encode(['error' => 'Title is required']));

            return $response->withHeader('Content-Type', 'application/json')->withStatus(422);
        }

        $this->dashboardService->assignSlot($args['section'], (int) $args['slotNumber'], $data['title']);
        $response->getBody()->write(\json_encode(['message' => 'Slot assigned successfully']));

        return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    }

    public function clearSlot(Response $response, Request $request, array $args): Response
    {
        $this->dashboardService->clearSlot($args['section'], (int) $args['slotNumber']);
        $response->getBody()->write(\json_encode(['message' => 'Slot cleared successfully']));

        return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    }
}
