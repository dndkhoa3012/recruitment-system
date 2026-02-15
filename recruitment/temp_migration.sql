-- AlterTable
ALTER TABLE `Banner` 
  DROP COLUMN `imageUrl`,
  ADD COLUMN `imageUrls` JSON NOT NULL;

-- Update existing banners to convert single imageUrl to array format
-- This is done in a custom migration to handle existing data
