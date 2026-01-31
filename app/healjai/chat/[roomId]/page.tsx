
import ChatInterface from '@/components/healjai/ChatInterface';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Room - Healjai',
  description: 'Chat Room',
};

// Next.js 15: params should be awaited.
// Wait, the user is on Next.js 15+. 
// Ideally Page props types are Promise for params. But standard sync props usually work in basic setup unless using advanced features.
// However, to be safe and strictly follow Next 15 RSC patterns if param access is needed, we should be careful.
// But passing params to client component directly is fine.

export default async function ChatPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;
  return (
    <>
       <ChatInterface roomId={roomId} />
    </>
  );
}
