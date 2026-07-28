<?php

declare(strict_types=1);

namespace LogMonitor\Backend\Service;

use LogMonitor\Backend\Repository\DashboardRepository;
use LogMonitor\Backend\Repository\LogRepository;

final class DashboardService
{
  public function __construct(
    private DashboardRepository $dashboardRepository,
    private LogRepository $logRepository,
  ) {}

  public function getSlotsWithLogs(): array
  {
    $slots = $this->dashboardRepository->getAllSlots();

    $grouped = ['priority' => [], 'less_priority' => []];

    foreach ($slots as $slot) {
      $log = $slot['title'] ? $this->logRepository->getLatestLogByTitle($slot['title']) : null;

      if (null !== $log && \file_exists($log['file_path'])) {
        $log['file_size'] = \filesize($log['file_path']);
      }

      $grouped[$slot['section']][] = [
        'slot_number' => (int) $slot['slot_number'],
        'log'         => $log,
        'schedule'    => $slot['schedule'],
      ];
    }

    return $grouped;
  }

  public function getAllTitles(): array
  {
    return $this->logRepository->getAllTitles();
  }

  public function assignSlot(string $section, int $slotNumber, string $title, string $schedule): void
  {
    $this->dashboardRepository->assignSlot($section, $slotNumber, $title, $schedule);
  }

  public function clearSlot(string $section, int $slotNumber): void
  {
    $this->dashboardRepository->clearSlot($section, $slotNumber);
  }

  public function getExports(): array
  {
    $data = $this->logRepository->getExports();

    $exports = [];

    foreach ($data as $row) {
      $exports[] = [
        'file_name'     => $row['file_name'],
        'file_modified_at' => $row['file_modified_at'],
        'file_size' => \file_exists($row['file_path']) ? \filesize($row['file_path']) : null,
      ];
    }

    return $exports;
  }
}
