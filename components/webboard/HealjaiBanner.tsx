import Link from 'next/link';

interface HealjaiBannerProps {
  className?: string;
}

export default function HealjaiBanner({ className = '' }: HealjaiBannerProps) {
  return (
    <div className={`bg-white border border-rose-100 rounded-xl p-5 shadow-sm relative overflow-hidden group ${className}`}>
      {/* Decorative Circles - Minimal */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-50 rounded-full group-hover:bg-rose-100 transition-colors duration-500"></div>
      
      <div className="relative flex items-center justify-between gap-4">
        <div>
           <div className="inline-flex items-center gap-2 px-2 py-1 bg-rose-50 text-rose-600 text-[10px] font-bold uppercase rounded-md mb-2">
              New Feature
           </div>
           <h3 className="font-bold text-gray-800 text-lg">รู้สึกเหนื่อยไหม? มาพักใจที่ Healjai</h3>
           <p className="text-sm text-gray-500 mt-1 max-w-sm">
             พื้นที่ปลอดภัยสำหรับการระบายความรู้สึก จับคู่คุยกับเพื่อนใหม่ที่พร้อมรับฟังโดยไม่ตัดสิน
           </p>
           <Link href="/healjai" className="inline-block mt-4 text-sm font-semibold text-rose-500 hover:text-rose-600 hover:underline">
             เข้าสู่ห้องแชท &rarr;
           </Link>
        </div>
        <div className="hidden sm:block text-5xl opacity-80 group-hover:scale-110 transition-transform duration-300">
          ⛅
        </div>
      </div>
    </div>
  );
}
