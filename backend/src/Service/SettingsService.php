<?php

declare(strict_types=1);

namespace LogMonitor\Backend\Service;

use LogMonitor\Backend\Repository\SettingsRepository;

final class SettingsService
{
  public function __construct(private SettingsRepository $settingsRepository) {}

  public function getSettings(): array
  {
    return $this->settingsRepository->get();
  }

  public function updateSettings(array $newSettings): array
  {
    return $this->settingsRepository->update($newSettings);
  }
}
