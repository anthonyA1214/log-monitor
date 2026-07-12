<?php

declare(strict_types=1);

use LogMonitor\Backend\Controller\DashboardController;
use LogMonitor\Backend\Controller\LogController;
use LogMonitor\Backend\Controller\SettingsController;
use Slim\App;
use Slim\Routing\RouteCollectorProxy;

return static function (App $app): void {
    $app->group('/api', static function (RouteCollectorProxy $group): void {
        // api/dashboard
        $group->group('/dashboard', static function (RouteCollectorProxy $group): void {
            $group->get('/slots', [DashboardController::class, 'index']);
            $group->get('/titles', [DashboardController::class, 'titles']);
            $group->put('/slots/{section}/{slotNumber}', [DashboardController::class, 'assignSlot']);
            $group->delete('/slots/{section}/{slotNumber}', [DashboardController::class, 'clearSlot']);
        });

        // api/logs
        $group->group('/logs', static function (RouteCollectorProxy $group): void {
            $group->get('', [LogController::class, 'index']);
            $group->post('', [LogController::class, 'store']);
            $group->post('/sync', [LogController::class, 'sync']);
            $group->get('/{logId}', [LogController::class, 'show']);
            $group->get('/{logId}/content', [LogController::class, 'getContent']);
            $group->patch('/{logId}', [LogController::class, 'update']);
        });

        // api/settings
        $group->group('/settings', static function (RouteCollectorProxy $group): void {
            $group->get('', [SettingsController::class, 'index']);
            $group->patch('', [SettingsController::class, 'update']);
        });
    });
};
