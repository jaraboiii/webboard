import Link from 'next/link';

export default function Sidebar() {
  const menuItems = [
    { icon: '🏠', label: 'หน้าแรก', href: '/', active: true },
    { icon: '🔥', label: 'มาแรง', href: '/trending' },
    { icon: '💬', label: 'ทั่วไป', href: '/category/general' },
    { icon: '⛏️', label: 'Minecraft Server', href: '/category/minecraft' },
    { icon: '💻', label: 'Technology', href: '/category/tech' },
  ];

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <nav className="sticky top-20 space-y-8">
        {/* Main Menu */}
        <div>
          <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            เมนูหลัก
          </h3>
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  item.active
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-100' // Minimal active state
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Special Menu - Healjai */}
        <div>
          <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            พิเศษ
          </h3>
          <Link
            href="/healjai"
            className="group flex items-center gap-3 px-4 py-2.5 mx-2 text-sm font-medium rounded-lg bg-orange-50 text-orange-800 border border-orange-100 hover:bg-orange-100 transition-all"
          >
            <span className="text-lg group-hover:scale-110 transition-transform">❤️</span>
            <div className="flex flex-col">
              <span>Healjai</span>
              <span className="text-[10px] text-orange-600/80 font-normal">พื้นที่พักใจ</span>
            </div>
          </Link>
        </div>

        {/* Footer Links */}
        <div className="px-4 pt-4 border-t border-gray-100">
           <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-400">
             <a href="#" className="hover:text-gray-600">เกี่ยวกับเรา</a>
             <a href="#" className="hover:text-gray-600">กฎระเบียบ</a>
             <a href="#" className="hover:text-gray-600">ติดต่อ</a>
             <span>© 2024</span>
           </div>
        </div>
      </nav>
    </aside>
  );
}
