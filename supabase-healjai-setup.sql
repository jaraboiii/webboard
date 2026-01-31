-- ========================================
-- HealJAI Supabase Realtime Setup
-- ========================================
-- Run these SQL commands in Supabase SQL Editor
-- to enable Realtime for HealJAI chat feature
-- ========================================

-- Enable RLS on Healjai tables
ALTER TABLE healjai_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE healjai_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE healjai_messages ENABLE ROW LEVEL SECURITY;

-- Healjai Users Policies (Allow all operations - anonymous chat)
CREATE POLICY "Anyone can view healjai_users" 
ON healjai_users FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert healjai_users" 
ON healjai_users FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update healjai_users" 
ON healjai_users FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete healjai_users" 
ON healjai_users FOR DELETE 
USING (true);

-- Healjai Rooms Policies
CREATE POLICY "Anyone can view healjai_rooms" 
ON healjai_rooms FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert healjai_rooms" 
ON healjai_rooms FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update healjai_rooms" 
ON healjai_rooms FOR UPDATE 
USING (true);

-- Healjai Messages Policies
CREATE POLICY "Anyone can view healjai_messages" 
ON healjai_messages FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert healjai_messages" 
ON healjai_messages FOR INSERT 
WITH CHECK (true);

-- ========================================
-- Enable Realtime for Healjai tables
-- ========================================

-- Enable realtime for healjai_users table
ALTER PUBLICATION supabase_realtime ADD TABLE healjai_users;

-- Enable realtime for healjai_rooms table
ALTER PUBLICATION supabase_realtime ADD TABLE healjai_rooms;

-- Enable realtime for healjai_messages table
ALTER PUBLICATION supabase_realtime ADD TABLE healjai_messages;

-- ========================================
-- Verification Queries
-- ========================================

-- Check if realtime is enabled
SELECT tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';

-- Should show:
-- healjai_users
-- healjai_rooms  
-- healjai_messages
