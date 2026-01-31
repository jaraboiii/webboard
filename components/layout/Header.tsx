import Link from 'next/link';
import { createClient } from '@/app/lib/supabase/server';
import UserMenu from './UserMenu';

export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // If user exists, fetch their public profile name
  let profile = null;
  if (user) {
    try {
      const { data } = await supabase
        .from('users')
        .select('name, email, image')
        .eq('id', user.id)
        .single();
        
      profile = {
        name: data?.name || user.user_metadata?.full_name || 'User',
        email: user.email || '',
        avatarUrl: data?.image || user.user_metadata?.avatar_url || user.user_metadata?.picture
      };
    } catch {
      // Fallback if DB fetch fails
      profile = {
        name: user.user_metadata?.full_name || 'User',
        email: user.email || '',
        avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture
      };
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-lg">W</div>
          <span className="font-bold text-xl text-gray-900 tracking-tight">Webboard</span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-lg hidden sm:block">
          <div className="relative">
            <input
              type="text"
              placeholder="ค้นหากระทู้ที่น่าสนใจ..."
              className="w-full pl-4 pr-10 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-gray-400 focus:outline-none transition-all text-sm"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Auth Buttons or User Menu */}
        <div className="flex items-center gap-3">
          {user && profile ? (
            <UserMenu user={profile} />
          ) : (
            <>
              <Link href="/login" className="hidden sm:block text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                เข้าสู่ระบบ
              </Link>
              <Link href="/signup" className="text-sm font-medium bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-sm">
                สมัครสมาชิก
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
