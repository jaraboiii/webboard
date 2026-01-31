
import { pgTable, text, timestamp, uuid, integer, jsonb } from 'drizzle-orm/pg-core';

// Users Table (Basic schema foundation for Auth)
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Categories Table
export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Topics Table
export const topics = pgTable('topics', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  authorId: uuid('author_id').references(() => users.id).notNull(),
  categoryId: uuid('category_id').references(() => categories.id).notNull(),
  hashtags: jsonb('hashtags').$type<string[]>(),
  views: integer('views').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Comments Table
export const comments = pgTable('comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  topicId: uuid('topic_id').references(() => topics.id, { onDelete: 'cascade' }).notNull(),
  authorId: uuid('author_id').references(() => users.id).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// RLS Policies (will be applied via SQL after drizzle push)
// Run these SQL commands in Supabase SQL Editor after pushing schema:

/*
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all users" ON users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Categories policies
CREATE POLICY "Anyone can view categories" ON categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create categories" ON categories FOR INSERT TO authenticated WITH CHECK (true);

-- Topics policies
CREATE POLICY "Anyone can view topics" ON topics FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create topics" ON topics FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own topics" ON topics FOR UPDATE TO authenticated USING (auth.uid() = author_id);
CREATE POLICY "Users can delete own topics" ON topics FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- Comments policies
CREATE POLICY "Anyone can view comments" ON comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create comments" ON comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- Healjai policies
ALTER TABLE healjai_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE healjai_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE healjai_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view healjai_users" ON healjai_users FOR SELECT USING (true);
CREATE POLICY "Anyone can insert healjai_users" ON healjai_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update healjai_users" ON healjai_users FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete healjai_users" ON healjai_users FOR DELETE USING (true);

CREATE POLICY "Anyone can view healjai_rooms" ON healjai_rooms FOR SELECT USING (true);
CREATE POLICY "Anyone can insert healjai_rooms" ON healjai_rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update healjai_rooms" ON healjai_rooms FOR UPDATE USING (true);

CREATE POLICY "Anyone can view healjai_messages" ON healjai_messages FOR SELECT USING (true);
CREATE POLICY "Anyone can insert healjai_messages" ON healjai_messages FOR INSERT WITH CHECK (true);
*/

// Healjai Tables - For real-time anonymous chat matching
export const healjaiUsers = pgTable('healjai_users', {
  id: uuid('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role').notNull(), // 'suffering' or 'healing'
  roomId: uuid('room_id'),
  status: text('status').notNull().default('waiting'), // 'waiting', 'matched', 'chatting', 'left'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastActiveAt: timestamp('last_active_at').defaultNow().notNull(),
});

export const healjaiRooms = pgTable('healjai_rooms', {
  id: uuid('id').defaultRandom().primaryKey(),
  sufferingUserId: uuid('suffering_user_id'),
  healingUserId: uuid('healing_user_id'),
  isActive: integer('is_active').default(1).notNull(), // 1 = active, 0 = ended
  createdAt: timestamp('created_at').defaultNow().notNull(),
  endedAt: timestamp('ended_at'),
});

export const healjaiMessages = pgTable('healjai_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  roomId: uuid('room_id').references(() => healjaiRooms.id, { onDelete: 'cascade' }).notNull(),
  senderId: uuid('sender_id'), // can be null for system messages
  senderName: text('sender_name').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
