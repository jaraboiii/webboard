
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import TopicCard from '@/components/webboard/TopicCard';
import HealjaiBanner from '@/components/webboard/HealjaiBanner';
import PostButton from '@/components/webboard/PostButton';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Webboard - Community & Discussions',
  description: 'Sharing ideas, questions, and experiences with the community.',
};

// Mock async data fetching
async function getTopics() {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate latency
  return [
    { id: '1', title: 'สอบถามวิธีแก้ปัญหา Next.js 15 Hydration Error ครับ', author: 'DevNewbie', category: 'Programming', replies: 12, timeAgo: '2ชม. ที่แล้ว' },
    { id: '2', title: 'Minecraft Server SS4 เปิดเมื่อไหร่ครับ?', author: 'CreeperLover', category: 'Minecraft', replies: 56, timeAgo: '5ชม. ที่แล้ว' },
    { id: '3', title: 'วันนี้รู้สึกดิ่งมากเลย... ไม่รู้จะคุยกับใครดี', author: 'AloneCat', category: 'Healjai', replies: 8, timeAgo: '1วัน ที่แล้ว' },
    { id: '4', title: 'รีวิว Keyboard Custom ตัวแรกในชีวิต หมดไป 5000 คุ้มไหม?', author: 'MechKey', category: 'Review', replies: 23, timeAgo: '1วัน ที่แล้ว' },
    { id: '5', title: 'หาเพื่อนเล่น Valheim ครับ เริ่มใหม่', author: 'Viking007', category: 'Games', replies: 2, timeAgo: '2วัน ที่แล้ว' },
  ];
}

async function Feed() {
  const topics = await getTopics();
  return (
    <div className="space-y-3">
      {topics.map((topic) => (
        <TopicCard key={topic.id} {...topic} />
      ))}
    </div>
  );
}

function FeedSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 h-32 animate-pulse">
            <div className="h-4 bg-gray-100 rounded w-1/4 mb-4"></div>
            <div className="h-6 bg-gray-100 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-100 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-900 font-sans">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar (Hides on mobile in real app, simplified here) */}
          <div className="hidden md:block">
            <Sidebar />
          </div>

          {/* Main Feed */}
          <div className="flex-1 min-w-0 space-y-6">
            
            {/* Mobile Healjai Banner */}
            <HealjaiBanner />
            
            {/* Feed Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold tracking-tight text-gray-900">
                กระทู้ล่าสุด
              </h1>
              <select className="text-sm border-gray-200 rounded-lg px-2 py-1 text-gray-600 focus:ring-black">
                <option>ล่าสุด</option>
                <option>ยอดนิยม</option>
              </select>
            </div>

            {/* Suspense for Loading State */}
            <Suspense fallback={<FeedSkeleton />}>
              <Feed />
            </Suspense>
          </div>

          {/* Right Column (Optional - Trending/Ads) */}
          <div className="hidden lg:block w-72 space-y-6">
             <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-3">แท็กยอดนิยม</h3>
                <div className="flex flex-wrap gap-2">
                   {['Minecraft', 'Coding', 'ระบายใจ', 'Review', 'K-Pop'].map(tag => (
                      <span key={tag} className="px-3 py-1 bg-gray-50 text-xs font-medium text-gray-600 rounded-full hover:bg-gray-100 cursor-pointer">
                         #{tag}
                      </span>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </main>

      <PostButton />
    </div>
  );
}
