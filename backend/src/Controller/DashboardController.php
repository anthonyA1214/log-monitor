<?php

declare(strict_types=1);

namespace LogMonitor\Backend\Controller;

use LogMonitor\Backend\Service\DashboardService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class DashboardController
{
  public function __construct(private DashboardService $dashboardService) {}

  public function index(Response $response, Request $request): Response
  {

    return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
  }
}
