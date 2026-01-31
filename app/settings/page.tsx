import { createClient } from '@/app/lib/supabase/server';
import { redirect } from 'next/navigation';
import SettingsForm from './settings-form';
import Header from '@/components/layout/Header';

export default async function SettingsPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch current profile data safely
  let profile = null;
  try {
    const response = await supabase
      .from('users')
      .select('name, image') // Try selecting 'image' column which seems to be the one used in callback
      .eq('id', user.id)
      .single();
    profile = response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
  }

  const userName = profile?.name || user.user_metadata?.full_name || '';
  const userAvatar = profile?.image || user.user_metadata?.avatar_url || user.user_metadata?.picture || '';

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-8 sm:p-10">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">ตั้งค่าบัญชี</h1>
                <p className="text-gray-500 mb-8">จัดการข้อมูลส่วนตัวของคุณ</p>

                <SettingsForm user={{ name: userName, email: user.email || '', avatarUrl: userAvatar }} />
                
            </div>
            </div>
        </div>
      </main>
    </div>
  );
}
