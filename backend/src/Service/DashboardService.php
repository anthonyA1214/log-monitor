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

      $grouped[$slot['section']][] = [
        'slot_number' => (int) $slot['slot_number'],
        'log'         => $log,
      ];
    }

    return $grouped;
  }

  public function getAllTitles(): array
  {
    return $this->logRepository->getAllTitles();
  }

  public function assignSlot(string $section, int $slotNumber, string $title): void
  {
    $this->dashboardRepository->assignSlot($section, $slotNumber, $title);
  }

  public function clearSlot(string $section, int $slotNumber): void
  {
    $this->dashboardRepository->clearSlot($section, $slotNumber);
  }
}
