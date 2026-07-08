SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for 'app_settings'
-- ----------------------------
DROP TABLE IF EXISTS `app_settings`;

CREATE TABLE IF NOT EXISTS `app_settings` (
  `id` INT NOT NULL,
  `settings` JSON NOT NULL,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  CHECK (id = 1)
);

INSERT INTO app_settings (id, settings) VALUES (
  1,
  JSON_OBJECT(
    'logs_directory', '/var/log/myapp',
    'common_prefix', JSON_ARRAY()
  )
);

-- ----------------------------
-- Table structure for 'log_files'
-- ----------------------------
DROP TABLE IF EXISTS `log_files`;

CREATE TABLE IF NOT EXISTS `log_files` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255),
    `file_name` VARCHAR(255) NOT NULL,
    `file_path` VARCHAR(500) NOT NULL,
    `file_modified_at` DATETIME NOT NULL,
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    `source` ENUM('sync', 'manual') NOT NULL DEFAULT 'sync',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `log_files_file_path_unique` (`file_path`)
);

SET FOREIGN_KEY_CHECKS = 1;
