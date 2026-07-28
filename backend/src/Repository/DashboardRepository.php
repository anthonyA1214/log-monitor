<?php

declare(strict_types=1);

namespace LogMonitor\Backend\Repository;

final class DashboardRepository
{
  public function __construct(
    private \PDO $pdo,
    private LogRepository $logRepository,
  ) {}

  public function getAllSlots(): array
  {
    $sql = 'SELECT section, slot_number, title, schedule FROM dashboard_slots ORDER BY section, slot_number';

    $stmt = $this->pdo->query($sql);

    return $stmt->fetchAll();
  }

  public function getAllSlotsWithLogs(): array
  {
    $slots   = $this->getAllSlots();
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

  public function assignSlot(string $section, int $slotNumber, string $title, string $schedule): void
  {
    $this->pdo->beginTransaction();

    try {
      $stmt = $this->pdo->prepare('UPDATE dashboard_slots SET title = NULL, schedule = NULL WHERE title = :title');
      $stmt->execute([':title' => $title]);

      $stmt = $this->pdo->prepare('UPDATE dashboard_slots SET title = :title, schedule = :schedule WHERE section = :section AND slot_number = :slot_number');
      $stmt->execute([
        'title'       => $title,
        'schedule'    => $schedule,
        'section'     => $section,
        'slot_number' => $slotNumber,
      ]);

      $this->pdo->commit();
    } catch (\Exception $e) {
      $this->pdo->rollBack();

      throw $e;
    }
  }

  public function clearSlot(string $section, int $slotNumber): void
  {
    $sql  = 'UPDATE dashboard_slots title = NULL WHERE section = :section AND slot_number = :slot_number';
    $stmt = $this->pdo->prepare($sql);
    $stmt->execute([
      ':section'     => $section,
      ':slot_number' => $slotNumber,
    ]);
  }
}
