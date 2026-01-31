// HealJAI Type Definitions
export type Role = 'suffering' | 'healing';

export interface HealjaiUser {
  id: string;
  name: string;
  role: Role;
  room_id?: string | null;
  status: 'waiting' | 'matched' | 'chatting' | 'left';
  created_at: string;
  last_active_at: string;
}

export interface HealjaiRoom {
  id: string;
  suffering_user_id: string | null;
  healing_user_id: string | null;
  is_active: number; // 0 or 1
  created_at: string;
  ended_at?: string | null;
}

export interface HealjaiMessage {
  id: string;
  room_id: string;
  sender_id: string | null;
  sender_name: string;
  content: string;
  created_at: string;
}

// Legacy types for component compatibility
export interface User {
  id: string;
  name: string;
  role: Role;
  joinedAt?: number;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
}
