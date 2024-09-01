-- Custom SQL migration file, put you code below! --
-- copy qr background setting
UPDATE "user"
SET qr_background = setting.qr_background
FROM setting
WHERE setting.user_id = "user".id;
-- copy qr foreground setting
UPDATE "user"
SET qr_foreground = setting.qr_foreground
FROM setting
WHERE setting.user_id = "user".id;