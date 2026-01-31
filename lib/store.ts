
export type Role = 'suffering' | 'healing';

export interface User {
  id: string;
  name: string;
  role: Role;
  joinedAt: number;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
}

export interface Room {
  id: string;
  sufferingUserId: string | null;
  healingUserId: string | null;
  messages: Message[];
  isActive: boolean;
  createdAt: number;
}

class HealjaiStore {
  users: Map<string, User> = new Map();
  rooms: Map<string, Room> = new Map();
  waitingSuffering: string[] = [];
  waitingHealing: string[] = [];

  addUser(user: User) {
    this.users.set(user.id, user);
  }

  getUser(userId: string) {
    return this.users.get(userId);
  }

  addToQueue(userId: string, role: Role) {
    if (role === 'suffering') {
      if (!this.waitingSuffering.includes(userId)) this.waitingSuffering.push(userId);
    } else {
      if (!this.waitingHealing.includes(userId)) this.waitingHealing.push(userId);
    }
  }

  findMatch(): Room | null {
    // Try to pair suffering with healing
    if (this.waitingSuffering.length > 0 && this.waitingHealing.length > 0) {
      const sufferingId = this.waitingSuffering.shift()!;
      const healingId = this.waitingHealing.shift()!;
      
      const roomId = `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const room: Room = {
        id: roomId,
        sufferingUserId: sufferingId,
        healingUserId: healingId,
        messages: [],
        isActive: true,
        createdAt: Date.now()
      };
      
      this.rooms.set(roomId, room);
      return room;
    }
    return null;
  }

  getRoom(roomId: string) {
    return this.rooms.get(roomId);
  }

  findUserRoom(userId: string): Room | null {
    for (const room of this.rooms.values()) {
        if (room.isActive && (room.sufferingUserId === userId || room.healingUserId === userId)) {
            return room;
        }
    }
    return null;
  }

  removeUser(userId: string) {
    this.waitingSuffering = this.waitingSuffering.filter(id => id !== userId);
    this.waitingHealing = this.waitingHealing.filter(id => id !== userId);
    this.users.delete(userId);
    
    // If in a room, close it
    const room = this.findUserRoom(userId);
    if (room) {
        room.isActive = false;
        // Optionally add a system message
        room.messages.push({
            id: 'system-end',
            senderId: 'system',
            senderName: 'System',
            content: 'คู่สนทนาของคุณได้ออกจากห้องแล้ว การสนทนาสิ้นสุดลง',
            timestamp: Date.now()
        });
    }
  }
}

const globalForStore = globalThis as unknown as { healjaiStore: HealjaiStore };
export const store = globalForStore.healjaiStore || new HealjaiStore();
if (process.env.NODE_ENV !== 'production') globalForStore.healjaiStore = store;
