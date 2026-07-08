<?php

declare(strict_types=1);

namespace LogMonitor\Backend\Repository;

final class LogRepository
{
    public function __construct(private \PDO $pdo)
    {
    }

    public function insert(?string $title, string $fileName, string $filePath, string $fileModifiedAt): array
    {
        $sql = <<<'EOD'
            INSERT INTO log_files (title, file_name, file_path, file_modified_at, status, source)
            VALUES (:title, :file_name, :file_path, :file_modified_at, 'active', 'manual')
        EOD;

        $stmt = $this->pdo->prepare($sql)->execute([
            ':title'            => $title,
            ':file_name'        => $fileName,
            ':file_path'        => $filePath,
            ':file_modified_at' => $fileModifiedAt,
        ]);

        return [
            'id'               => (int) $this->pdo->lastInsertId(),
            'title'            => $title,
            'file_name'        => $fileName,
            'file_path'        => $filePath,
            'file_modified_at' => $fileModifiedAt,
        ];
    }

    public function filePathExists(string $filePath): bool
    {
        $sql = 'SELECT COUNT(*) FROM log_files WHERE file_path = :file_path';

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':file_path' => $filePath]);

        return (int) $stmt->fetchColumn() > 0;
    }

    public function upsert(string $fileName, string $filePath, string $fileModifiedAt): void
    {
        $title = \preg_replace('/[_-]\d{4}-?\d{2}-?\d{2}/', '', $fileName);
        $title = \str_replace('.txt', '', $title);

        if ($this->filePathExists($filePath)) {
            $sql = <<<'EOD'
            UPDATE log_files SET file_modified_at = :file_modified_at, status = 'active'
            WHERE file_path = :file_path
            EOD;

            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([
                ':file_modified_at' => $fileModifiedAt,
                'file_path'         => $filePath,
            ]);
        } else {
            $sql = <<<'EOD'
                INSERT INTO log_files (title, file_name, file_path, file_modified_at, status, source)
                VALUES (:title, :file_name, :file_path, :file_modified_at, 'active', 'sync')
            EOD;

            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([
                ':title'            => $title,
                ':file_name'        => $fileName,
                ':file_path'        => $filePath,
                ':file_modified_at' => $fileModifiedAt,
            ]);
        }
    }

    public function markInactive(array $activeFiles): void
    {
        if (empty($activeFiles)) {
            // If no active files, mark all as inactive
            $sql = "UPDATE log_files SET status = 'inactive' WHERE source = 'sync'";
            $this->pdo->exec($sql);

            return;
        }

        // Mark files not in the active list as inactive
        $placeholders = \implode(',', \array_fill(0, \count($activeFiles), '?'));
        $sql          = "UPDATE log_files SET status = 'inactive' WHERE file_path NOT IN ({$placeholders}) AND source = 'sync'";
        $stmt         = $this->pdo->prepare($sql);
        $stmt->execute($activeFiles);
    }

    public function deactivateOldLogs(): void
    {
        $sql  = "SELECT id, file_name FROM log_files WHERE source = 'sync' AND status = 'active'";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();

        $rows = $stmt->fetchAll();

        $grouped = [];

        foreach ($rows as $row) {
            $cleaned = \preg_replace('/-\d{4}-\d{2}-\d{2}/', '', $row['file_name']);

            if (\preg_match('/^(.+)_(\d{8})\.txt$/', $cleaned, $matches)) {
                $prefix             = $matches[1];
                $date               = $matches[2];
                $grouped[$prefix][] = [
                    'id'   => $row['id'],
                    'date' => $date,
                ];
            }
        }

        $idsToDeactivate = [];

        foreach ($grouped as $prefix => $entries) {
            $latestDate = \max(\array_column($entries, 'date'));

            foreach ($entries as $entry) {
                if ($entry['date'] < $latestDate) {
                    $idsToDeactivate[] = $entry['id'];
                }
            }
        }

        if (empty($idsToDeactivate)) {
            return;
        }

        $placeholders = \implode(',', \array_fill(0, \count($idsToDeactivate), '?'));
        $sql          = "UPDATE log_files SET status = 'inactive' WHERE id IN ({$placeholders})";
        $update       = $this->pdo->prepare($sql);
        $update->execute($idsToDeactivate);
    }

    public function findCurrentLogs(): array
    {
        $sql  = "SELECT * FROM log_files WHERE source = 'sync' ORDER BY file_modified_at DESC";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();

        $rows    = $stmt->fetchAll();
        $grouped = [];

        foreach ($rows as $row) {
            $cleaned = \preg_replace('/-\d{4}-\d{2}-\d{2}/', '', $row['file_name']);

            if (\preg_match('/^(.+)_(\d{8})\.txt$/', $cleaned, $matches)) {
                $prefix = $matches[1];

                $grouped[$prefix][] = $row;
            }
        }

        $today       = \date('Y-m-d');
        $currentLogs = [];

        foreach ($grouped as $prefix => $entries) {
            \usort($entries, static fn ($a, $b) => \strcmp($b['file_modified_at'], $a['file_modified_at']));

            $todaysEntries = \array_filter($entries, static function ($entry) use ($today) {
                return \mb_substr($entry['file_modified_at'], 0, 10) === $today;
            });

            $current  = !empty($todaysEntries) ? $todaysEntries[0] : $entries[0];
            $children = \array_slice(\array_values(\array_filter($entries, static function ($entry) use ($current) {
                return $entry['id'] !== $current['id'];
            })), 0, 10);

            $current['children'] = $children;
            $currentLogs[]       = $current;
        }

        return $currentLogs;
    }

    public function updateModifiedAt(int $id, string $fileModifiedAt): void
    {
        $sql = 'UPDATE log_files SET file_modified_at = :file_modified_at WHERE id = :id';

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':file_modified_at' => $fileModifiedAt,
            ':id'               => $id,
        ]);
    }

    public function markInactiveById(int $id): void
    {
        $sql  = "UPDATE log_files SET status = 'inactive' WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':id' => $id,
        ]);
    }

    public function findById(int $id): ?array
    {
        $sql = 'SELECT id, title, file_name, file_path, file_modified_at, source, status FROM log_files WHERE id = :id';

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':id' => $id]);

        return $stmt->fetch() ?: null;
    }

    public function updateLogInfo(int $id, array $data): void
    {
        $sql = 'UPDATE log_files SET title = :title, file_name = :file_name, file_path = :file_path WHERE id = :id';

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':title'     => $data['title'] ?? null,
            ':file_name' => $data['file_name'],
            ':file_path' => $data['file_path'],
            ':id'        => $id,
        ]);
    }
}
