<?php

declare(strict_types=1);

namespace LogMonitor\Backend\Controller;

use LogMonitor\Backend\Service\DashboardService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class DashboardController
{
  public function __construct(private DashboardService $dashboardService) {}

  public function index(Request $request, Response $response): Response
  {
    $dashboardData = $this->dashboardService->getSlotsWithLogs();
    $response->getBody()->write(\json_encode($dashboardData));

    return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
  }

  public function titles(Request $request, Response $response): Response
  {
    $titles = $this->dashboardService->getAllTitles();
    $response->getBody()->write(\json_encode($titles));

    return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
  }

  public function assignSlot(Request $request, Response $response, string $section, int $slotNumber): Response
  {
    $data = $request->getParsedBody();

    if (empty($data['title'] || $data['schedule'])) {
      $response->getBody()->write(\json_encode(['error' => 'Title is required']));

      return $response->withHeader('Content-Type', 'application/json')->withStatus(422);
    }

    $this->dashboardService->assignSlot($section, $slotNumber, $data['title'], $data['schedule']);
    $response->getBody()->write(\json_encode(['message' => 'Slot assigned successfully']));

    return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
  }

  public function clearSlot(Request $request, Response $response, string $section, int $slotNumber): Response
  {
    $this->dashboardService->clearSlot($section, $slotNumber);
    $response->getBody()->write(\json_encode(['message' => 'Slot cleared successfully']));

    return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
  }

  public function exports(Request $request, Response $response): Response
  {
    $exports = $this->dashboardService->getExports();
    $response->getBody()->write(\json_encode($exports));

    return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
  }
}
