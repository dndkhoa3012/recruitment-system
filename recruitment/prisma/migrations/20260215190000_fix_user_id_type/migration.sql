-- Fix User table id type from VARCHAR to INTEGER AUTO_INCREMENT
-- This handles servers that ran the old migration with VARCHAR id

-- Delete existing users (only admin placeholder)
DELETE FROM `User`;

-- Drop and recreate with correct type
ALTER TABLE `User` DROP PRIMARY KEY;
ALTER TABLE `User` MODIFY COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (`id`);
