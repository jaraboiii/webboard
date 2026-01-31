import Modal from '@/components/ui/modal';
import CreateTopicForm from '@/app/create-topic/create-topic-form';
import { createClient } from '@/app/lib/supabase/server';

export default async function CreateTopicModal() {
  const supabase = await createClient();

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
    <Modal>
      <div className="mx-auto max-h-[85vh] overflow-y-auto">
        <div className="px-8 py-6 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">ตั้งกระทู้ใหม่</h2>
          <p className="text-gray-500 text-sm mt-1">แบ่งปันความคิด คำถาม หรือประสบการณ์ของคุณกับชุมชน</p>
        </div>
        
        <div className="px-8 py-8">
          <CreateTopicForm categories={popularCategories} />
        </div>
      </div>
    </Modal>
  );
}
