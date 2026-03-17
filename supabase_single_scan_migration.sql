-- Add single_scans_purchased column to profiles for $9 tier tracking
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS single_scans_purchased INTEGER DEFAULT 0;
