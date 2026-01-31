'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { sendChatMessage, getMessages, leaveChat, getRoomData } from '../../app/healjai/actions';
import { User } from '@/lib/store';

interface ChatInterfaceProps {
  roomId: string;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
}

export default function ChatInterface({ roomId }: ChatInterfaceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Initial Check
  useEffect(() => {
    if (!userId) {
      router.push('/healjai');
      return;
    }
    getRoomData(roomId, userId).then((data) => {
        if (data.error) {
            router.push('/healjai');
        } else {
            setOtherUser(data.otherUser || null);
            setIsLoading(false);
        }
    });

    return () => {};
  }, [roomId, userId, router]);

  // Polling
  useEffect(() => {
    if (!userId) return;

    const interval = setInterval(async () => {
      const result = await getMessages(roomId);
      if (result) {
        setMessages(prev => {
            if (prev.length !== result.messages.length) {
                setTimeout(scrollToBottom, 100);
                return result.messages;
            }
            return prev;
        });
        
        if (!result.isActive) {
           setIsActive(false);
           clearInterval(interval);
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [roomId, userId]);

  const handleSend = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!inputText.trim() || !userId) return;
  
      const text = inputText;
      setInputText(''); 
      
      await sendChatMessage(roomId, userId, text);
      const result = await getMessages(roomId);
      if (result) {
          setMessages(result.messages);
          scrollToBottom();
      }
    };
  
    const handleExit = async () => {
      if (!userId) return;
      if (confirm('ยืนยันที่จะจบการสนทนาในกระทู้นี้?')) {
          await leaveChat(roomId, userId);
          router.push('/healjai');
      }
    };
  
    if (isLoading) {
      return (
          <div className="flex flex-col items-center justify-center p-12 bg-white border border-gray-200 rounded-xl">
             <div className="w-8 h-8 border-4 border-gray-200 border-t-slate-500 rounded-full animate-spin mb-4"></div>
             <p className="text-gray-500">กำลังโหลดข้อมูลกระทู้...</p>
          </div>
      );
    }

  return (
    <div className="space-y-6">
       {/* Thread Header */}
       <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex justify-between items-start">
           <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${otherUser?.role === 'suffering' ? 'bg-blue-100 text-blue-500' : 'bg-yellow-100 text-yellow-500'}`}>
                    {otherUser?.role === 'suffering' ? '🌧️' : '☀️'}
                </div>
                <div>
                   <div className="flex items-center gap-2">
                      <h1 className="text-xl font-bold text-gray-900">{otherUser?.name || 'User'}</h1>
                      <span className="px-2 py-0.5 rounded textxs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                        {otherUser?.role === 'suffering' ? 'โหมดระบาย' : 'โหมดรับฟัง'}
                      </span>
                   </div>
                   <p className="text-sm text-gray-500 mt-1">
                      {isActive ? 'กำลังออนไลน์ • โต้ตอบทันที' : 'กระทู้นี้ถูกปิดแล้ว'}
                   </p>
                </div>
           </div>
           
           <button 
             onClick={handleExit}
             className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 hover:text-red-600 transition-colors"
           >
             ปิดกระทู้
           </button>
       </div>

       {/* Thread Content / Messages */}
       <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm min-h-[500px] flex flex-col">
          {messages.length === 0 && isActive && (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 opacity-60">
                  <div className="text-4xl mb-4">💬</div>
                  <p>ยังไม่มีข้อความ เริ่มต้นทักทายได้เลย</p>
              </div>
          )}

          <div className="flex-1 space-y-6 mb-6">
            {messages.map((msg) => {
              const isMe = msg.senderId === userId;
              const isSystem = msg.senderId === 'system';

              if (isSystem) {
                  return (
                      <div key={msg.id} className="relative py-4">
                          <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-gray-200"></div>
                          </div>
                          <div className="relative flex justify-center">
                            <span className="bg-white px-2 text-sm text-gray-500">{msg.content}</span>
                          </div>
                      </div>
                  );
              }

              return (
                <div key={msg.id} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                   <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded border flex items-center justify-center text-sm font-bold ${
                          isMe ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-gray-700 border-gray-200'
                      }`}>
                          {msg.senderName.substring(0, 1)}
                      </div>
                   </div>

                   {/* Content Bubble (Webboard Style similar to a post) */}
                   <div className={`flex-1 max-w-3xl ${isMe ? 'text-right' : 'text-left'}`}>
                      <div className="flex items-center gap-2 mb-1 text-xs text-gray-500" style={{flexDirection: isMe ? 'row-reverse' : 'row'}}>
                          <span className="font-bold text-gray-900">{msg.senderName}</span>
                          <span>•</span>
                          <span>{new Date(msg.timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      
                      <div className={`inline-block py-3 px-4 rounded-lg border text-sm md:text-base leading-relaxed ${
                          isMe 
                          ? 'bg-blue-50 border-blue-100 text-blue-900' 
                          : 'bg-white border-gray-200 text-gray-800'
                      }`}>
                          {msg.content}
                      </div>
                   </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Reply Area (Sticky Bottom within card would be nice, or just bottom) */}
          {isActive ? (
             <div className="border-t border-gray-100 pt-5">
                <form onSubmit={handleSend} className="relative">
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="เขียนข้อความตอบกลับ..."
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 p-4 min-h-[80px] focus:bg-white focus:border-slate-400 focus:ring-0 transition-colors text-sm resize-none pr-14"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend(e);
                            }
                        }}
                    />
                    <button 
                        type="submit"
                        disabled={!inputText.trim()}
                        className="absolute bottom-3 right-3 p-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 disabled:opacity-50 transition-all font-medium text-xs sm:text-sm"
                    >
                        ส่งข้อความ
                    </button>
                </form>
             </div>
          ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center text-gray-500 text-sm">
                    กระทู้นี้ถูกปิดการใช้งานแล้ว ไม่สามารถตอบกลับได้
                    <button onClick={() => router.push('/healjai')} className="text-blue-600 hover:underline ml-2">
                        กลับสู่หน้าหลัก
                    </button>
                </div>
          )}
       </div>
    </div>
  );
}
