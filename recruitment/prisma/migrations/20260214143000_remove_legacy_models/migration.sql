-- Drop foreign key constraints (if any exist implicitly, though dropping tables usually handles this in MySQL if order is correct)

-- Drop Menu tables
DROP TABLE IF EXISTS `Menu`;
DROP TABLE IF EXISTS `MenuCategory`;

-- Drop Gallery tables
DROP TABLE IF EXISTS `GalleryImage`;
DROP TABLE IF EXISTS `GalleryCollection`;
DROP TABLE IF EXISTS `GalleryCategory`;

-- Drop Banner table
DROP TABLE IF EXISTS `Banner`;

-- Drop Booking table
DROP TABLE IF EXISTS `Booking`;

-- Drop Event tables
DROP TABLE IF EXISTS `Event`;
DROP TABLE IF EXISTS `EventCategory`;
