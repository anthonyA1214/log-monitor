<?php

declare(strict_types=1);

namespace LogMonitor\Backend\Service;

use LogMonitor\Backend\Repository\LogRepository;

final class LogService
{
    public function __construct(
        private SettingsService $settingsService,
        private LogRepository $logRepository,
        private \PDO $pdo,
    ) {
    }

    public function getLogFiles(): array
    {
        $syncLogs   = $this->logRepository->findCurrentLogs();
        $manualLogs = $this->logRepository->findManualLogs();
        $logs       = \array_merge($syncLogs, $manualLogs);

        $result = [];

        foreach ($logs as $log) {
            $filePath = $log['file_path'];

            if (!\file_exists($filePath)) {
                $this->logRepository->markInactiveById((int) $log['id']);

                continue; // Skip files that no longer exist
            }

            $fileModifiedAt = \date('Y-m-d H:i:s', \filemtime($filePath));

            if ($fileModifiedAt !== $log['file_modified_at']) {
                $this->logRepository->updateModifiedAt((int) $log['id'], $fileModifiedAt);
            }

            $result[] = $log;
        }

        return $result;
    }

    public function addLogFiles(array $logs): array
    {
        $createdLogs = [];

        $this->pdo->beginTransaction();

        try {
            foreach ($logs as $log) {
                $fileModifiedAt = \date('Y-m-d H:i:s', \filemtime($log['file_path']));

                $createdLogs[] = $this->logRepository->insert(
                    $log['title'],
                    $log['file_name'],
                    $log['file_path'],
                    $fileModifiedAt,
                );
            }

            $this->pdo->commit();
        } catch (\Exception $e) {
            $this->pdo->rollBack();

            throw $e;
        }

        return $createdLogs;
    }

    public function syncLogs(): void
    {
        $settings = $this->settingsService->getSettings();

        $logsDir      =  $settings['logs_directory'] ?? '';
        $commonPrefix = $settings['common_prefix']   ?? [];

        $files       = \glob($logsDir . '/*.txt');
        $activeFiles = [];

        foreach ($files as $file) {
            $fileName = \basename($file);

            if (!self::isValidLogFile($fileName)) {
                continue; // Skip files that don't match the expected pattern
            }

            if (!empty($commonPrefix)) {
                $matched = false;

                foreach ($commonPrefix as $prefix) {
                    if (\str_starts_with($fileName, $prefix)) {
                        $matched = true;

                        break;
                    }
                }

                if (!$matched) {
                    continue; // Skip files that don't match any prefix
                }
            }

            $filePath       = \realpath($file);
            $fileModifiedAt = \date('Y-m-d H:i:s', \filemtime($file));

            $this->logRepository->upsert($fileName, $filePath, $fileModifiedAt);
            $activeFiles[] = $filePath;
        }

        $this->logRepository->markInactive($activeFiles);
        $this->logRepository->deactivateOldLogs();
    }

    public function getLogInfo(string $logId): ?array
    {
        $log = $this->logRepository->findById((int) $logId);

        if (!$log) {
            return null;
        }

        $filePath = $log['file_path'];

        if (!\file_exists($filePath)) {
            return null;
        }

        return [
            'id'               => $log['id'],
            'title'            => $log['title'],
            'file_name'        => $log['file_name'],
            'file_path'        => $log['file_path'],
            'file_modified_at' => \date('c', \filemtime($filePath)),
            'source'           => $log['source'],
            'status'           => $log['status'],
        ];
    }

    public function getLogContent(string $logId, ?int $offset = null): ?array
    {
        $log = $this->logRepository->findById((int) $logId);

        if (!$log) {
            return null;
        }

        $filePath = $log['file_path'];

        if (!\file_exists($filePath)) {
            return null;
        }

        $fileSize  = \filesize($filePath);
        $chunkSize = CHUNK_SIZE * 10; // Define your chunk size here

        if (null === $offset) {
            $offset = \max(0, $fileSize - $chunkSize);
        }

        $offset = \max(0, \min($offset, $fileSize));

        $fp = \fopen($filePath, 'rb');

        if (!$fp) {
            return null;
        }

        \fseek($fp, $offset);
        $content = \fread($fp, $chunkSize);
        \fclose($fp);

        return [
            'content'     => $content,
            'offset'      => $offset,
            'next_offset' => \min($offset + $chunkSize, $fileSize),
            'has_more'    => ($offset + $chunkSize) < $fileSize,
        ];
    }

    public function deleteLog(string $logId): bool
    {
        $log = $this->logRepository->findById((int) $logId);

        if (!$log) {
            return false;
        }

        $filePath = $log['file_path'];

        if (\file_exists($filePath)) {
            \unlink($filePath);
        }

        $this->logRepository->deleteById((int) $logId);

        return true;
    }

    public function updateLogInfo(string $logId, array $data): ?array
    {
        // Implementation for updating log info (e.g., title) by log ID
        $log = $this->logRepository->findById((int) $logId);

        if (!$log) {
            return null;
        }

        $this->logRepository->updateLogInfo((int) $logId, $data);

        return $this->getLogInfo($logId);
    }

    private static function isValidLogFile(string $fileName): bool
    {
        return (bool) \preg_match('/^.+_\d{8}\.txt$/', $fileName);
    }
}
