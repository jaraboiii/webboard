
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import TopicCard from '@/components/webboard/TopicCard';
import HealjaiBanner from '@/components/webboard/HealjaiBanner';
import PostButton from '@/components/webboard/PostButton';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { createClient } from '@/app/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Webboard - Community & Discussions',
  description: 'Sharing ideas, questions, and experiences with the community.',
};

// Fetch real data from Supabase
async function getTopics() {
  const supabase = await createClient();
  
  const { data: topics, error } = await supabase
    .from('topics')
    .select(`
      *,
      users (name),
      categories (name)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching topics:', error);
    return [];
  }


interface Topic {
  id: string;
  title: string;
  users: { name: string } | null;
  categories: { name: string } | null;
  created_at: string;
}

  return topics.map((topic: Topic) => ({
    id: topic.id,
    title: topic.title,
    author: topic.users?.name || 'Unknown',
    category: topic.categories?.name || 'General',
    replies: 0, 
    timeAgo: new Date(topic.created_at).toLocaleDateString('th-TH'),
  }));
}

async function getPopularCategories() {
    const supabase = await createClient();
    
    // In a real high-scale app, we might have a counter cache or dedicated analytics table.
    // For now, we query categories directly. 
    // If you want "Trending Tags" based on usage, we would count topic.category_id usage.
    // Simplified: Just getting lists of categories for now as "Tags"
    
    const { data: categories } = await supabase
        .from('categories')
        .select('name')
        .limit(5); // Just getting 5 categories to show as tags
        
    // Ideally: Select count(id) from topics group by category_id order by count desc
    
    return categories?.map(c => c.name) || [];
}

async function Feed() {
  const topics = await getTopics();

  if (topics.length === 0) {
    return (
        <div className="text-center py-20 text-gray-500 bg-white rounded-xl border border-gray-100">
            <p className="text-lg mb-2">ยังไม่มีกระทู้</p>
            <p className="text-sm">เป็นคนแรกที่เริ่มบทสนทนาได้เลย!</p>
        </div>
    );
  }

interface TopicProps {
  id: string;
  title: string;
  author: string;
  category: string;
  replies: number;
  timeAgo: string;
}

  return (
    <div className="space-y-3">
      {topics.map((topic: TopicProps) => (
        <TopicCard key={topic.id} {...topic} />
      ))}
    </div>
  );
}

async function PopularTags() {
    const tags = await getPopularCategories();
    
    if (tags.length === 0) return null;

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-3">แท็กยอดนิยม</h3>
            <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gray-50 text-xs font-medium text-gray-600 rounded-full hover:bg-gray-100 cursor-pointer">
                        #{tag}
                    </span>
                ))}
            </div>
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

function TagSkeleton() {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 h-32 animate-pulse">
            <div className="h-4 bg-gray-100 rounded w-1/4 mb-4"></div>
            <div className="flex gap-2">
               <div className="h-6 w-16 bg-gray-100 rounded-full"></div>
               <div className="h-6 w-20 bg-gray-100 rounded-full"></div>
               <div className="h-6 w-12 bg-gray-100 rounded-full"></div>
            </div>
        </div>
    )
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
             <Suspense fallback={<TagSkeleton />}>
                <PopularTags />
             </Suspense>
          </div>
        </div>
      </main>

      <PostButton />
    </div>
  );
}
