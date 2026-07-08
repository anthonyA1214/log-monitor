<?php

declare(strict_types=1);

namespace LogMonitor\Backend\Repository;

final class DashboardRepository
{
    public function __construct(private \PDO $pdo)
    {
    }
}
