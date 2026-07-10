<?php

declare(strict_types=1);

namespace LogMonitor\Backend\Repository;

final class SettingsRepository
{
    public function __construct(private \PDO $pdo)
    {
    }

    public function get(): array
    {
        $sql = 'SELECT settings FROM app_settings WHERE id = 1';

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();

        $row = $stmt->fetch();

        if (false === $row) {
            throw new \RuntimeException('Settings not found');
        }

        return self::decode($row['settings']);
    }

    public function update(array $settings): array
    {
        $sql = 'UPDATE app_settings SET settings = :settings WHERE id = 1';

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':settings' => self::encode($settings),
        ]);

        return $settings;
    }

    private static function decode(string $settings): array
    {
        try {
            return \json_decode($settings, true, 512, \JSON_THROW_ON_ERROR);
        } catch (\JsonException $e) {
            throw new \RuntimeException('Failed to decode JSON: ' . $e->getMessage(), 0, $e);
        }
    }

    private static function encode(array $data): string
    {
        try {
            return \json_encode($data, \JSON_THROW_ON_ERROR);
        } catch (\JsonException $e) {
            throw new \RuntimeException('Failed to encode JSON: ' . $e->getMessage(), 0, $e);
        }
    }
}
