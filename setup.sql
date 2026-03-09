-- ===== Claude Accord | Database Setup =====
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)

-- 1. Subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  tier text NOT NULL DEFAULT 'personal' CHECK (tier IN ('personal', 'business', 'creative')),
  created_at timestamptz DEFAULT now()
);

-- 2. Contacts table (for contact form)
CREATE TABLE IF NOT EXISTS contacts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 3. Enable Row Level Security
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies — allow anonymous inserts (for email capture & contact form)
CREATE POLICY "Allow anonymous insert to subscribers"
  ON subscribers FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous insert to contacts"
  ON contacts FOR INSERT
  TO anon
  WITH CHECK (true);

-- 5. Only authenticated users (admin) can read subscribers/contacts
CREATE POLICY "Admin read subscribers"
  ON subscribers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin read contacts"
  ON contacts FOR SELECT
  TO authenticated
  USING (true);
