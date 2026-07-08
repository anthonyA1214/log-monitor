<?php

declare(strict_types=1);

namespace LogMonitor\Backend\Service;

use LogMonitor\Backend\App\Settings;
use LogMonitor\Backend\Repository\DashboardRepository;

final class DashboardService
{
    public function __construct(
        private Settings $settings,
        private DashboardRepository $dashboardRepository,
    ) {
    }
}
