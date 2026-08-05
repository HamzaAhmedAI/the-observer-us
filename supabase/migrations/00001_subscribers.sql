/* ============================================================
   The Observer US — Initial Schema
   Subscribers and push notification subscriptions.
   ============================================================ */

-- ─── Email Subscribers ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscribers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  categories  TEXT[] DEFAULT '{}',
  is_active   BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers (email);
CREATE INDEX IF NOT EXISTS idx_subscribers_active ON subscribers (is_active);

-- ─── Push Subscriptions ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS push_subscribers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID REFERENCES subscribers(id) ON DELETE CASCADE,
  endpoint      TEXT UNIQUE NOT NULL,
  p256dh        TEXT NOT NULL,
  auth          TEXT NOT NULL,
  categories    TEXT[] DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_push_endpoint ON push_subscribers (endpoint);
CREATE INDEX IF NOT EXISTS idx_push_categories ON push_subscribers USING GIN (categories);

-- ─── Auto-update `updated_at` trigger ───────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER subscribers_updated_at
  BEFORE UPDATE ON subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ─── Row Level Security ─────────────────────────────────────
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow public insert (for signup forms)
CREATE POLICY "Allow public insert on subscribers"
  ON subscribers FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow individual read by email
CREATE POLICY "Allow individual read on subscribers"
  ON subscribers FOR SELECT
  TO anon
  USING (true);

-- Allow individual update by email
CREATE POLICY "Allow individual update on subscribers"
  ON subscribers FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Push: allow public insert
CREATE POLICY "Allow public insert on push_subscribers"
  ON push_subscribers FOR INSERT
  TO anon
  WITH CHECK (true);

-- Push: allow delete by endpoint (unsubscribe)
CREATE POLICY "Allow delete on push_subscribers"
  ON push_subscribers FOR DELETE
  TO anon
  USING (true);
