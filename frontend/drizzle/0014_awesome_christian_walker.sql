-- Custom SQL migration file, put you code below! --
UPDATE visitor
SET device_type = COALESCE(device_type, ''),
	device_vendor = COALESCE(device_vendor, ''),
	os = COALESCE(os, ''),
	browser = COALESCE(browser, '');