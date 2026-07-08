<?php

declare(strict_types=1);

namespace LogMonitor\Backend\Controller;

use LogMonitor\Backend\Service\SettingsService;
use Respect\Validation\Exceptions\NestedValidationException;
use Respect\Validation\Validator as v;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

final class SettingsController
{
  public function __construct(private SettingsService $settingsService) {}

  public function index(Request $request, Response $response): Response
  {
    $settings = $this->settingsService->getSettings();

    $response->getBody()->write(json_encode($settings));

    return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
  }

  public function update(Request $request, Response $response): Response
  {
    $data = $request->getParsedBody();

    if (isset($data['common_prefix']) && \is_string($data['common_prefix'])) {
      $data['common_prefix'] = \array_values(\array_filter(
        \array_map('trim', \explode(',', $data['common_prefix'])),
        static fn($v) => '' !== $v,
      ));
    }

    try {
      v::arrayType()
        ->key('logs_directory', v::stringType()->notEmpty())
        ->key('common_prefix', v::arrayType()->each(v::stringType()->notEmpty()))
        ->assert($data);
    } catch (NestedValidationException $e) {
      $response->getBody()->write(\json_encode([
        'error'    => 'Validation failed',
        'messages' => $e->getMessages(),
      ]));

      return $response->withHeader('Content-Type', 'application/json')->withStatus(422);
    }

    $updatedSettings = $this->settingsService->updateSettings([
      'logs_directory' => $data['logs_directory'],
      'common_prefix'  => $data['common_prefix'],
    ]);

    $response->getBody()->write(\json_encode($updatedSettings));

    return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
  }
}
