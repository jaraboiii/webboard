import { createClient } from '@/app/lib/supabase/server';
import { redirect } from 'next/navigation';
import CreateTopicForm from './create-topic-form';

export default async function CreateTopicPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch popular categories with topic count
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, topics(count)')
    .order('topics(count)', { ascending: false })
    .limit(10);

  // Transform to include count
  const popularCategories = categories?.map((cat: { id: string; name: string; topics?: Array<{ count: number }> }) => ({
    id: cat.id,
    name: cat.name,
    count: cat.topics?.[0]?.count || 0
  })) || [];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900">ตั้งกระทู้ใหม่</h1>
            <p className="text-gray-500 text-sm mt-1">แบ่งปันความคิด คำถาม หรือประสบการณ์ของคุณกับชุมชน</p>
          </div>
          
          <div className="px-8 py-8">
            <CreateTopicForm categories={popularCategories} />
          </div>
        </div>
      </div>
    </div>
  );
}
