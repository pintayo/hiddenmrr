-- Migration: Add free tier support
-- Run this in your Supabase SQL Editor

-- Add free scan counter to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS free_scans_used integer DEFAULT 0;

-- Add free scan flag to analyses
ALTER TABLE public.analyses
ADD COLUMN IF NOT EXISTS is_free_scan boolean DEFAULT false;
