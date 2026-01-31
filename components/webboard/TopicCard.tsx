import Link from 'next/link';

interface TopicCardProps {
  id: string;
  title: string;
  author: string;
  category: string;
  replies: number;
  timeAgo: string;
  read?: boolean;
}

export default function TopicCard({ id, title, author, category, replies, timeAgo, read = false }: TopicCardProps) {
  return (
    <Link 
      href={`/topic/${id}`}
      className="block group bg-white border border-gray-200 rounded-xl p-4 sm:p-5 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Meta Top */}
          <div className="flex items-center gap-2 mb-1.5 text-xs text-gray-500">
            <span className="font-medium px-2 py-0.5 bg-gray-100 rounded text-gray-600 group-hover:bg-gray-200 transition-colors">
              {category}
            </span>
            <span>•</span>
            <span className="font-medium text-gray-700">{author}</span>
            <span>•</span>
            <span>{timeAgo}</span>
          </div>
          
          {/* Title */}
          <h2 className={`text-base sm:text-lg ${read ? 'font-medium text-gray-600' : 'font-bold text-gray-900'} group-hover:text-blue-600 transition-colors line-clamp-2 md:line-clamp-1`}>
            {title}
          </h2>
          
          {/* Preview (Optional) */}
          <p className="mt-1 text-sm text-gray-500 line-clamp-1 hidden sm:block">
            ดูเหมือนว่าช่วงนี้ server จะมีปัญหาบ่อย อยากทราบว่าทีมงานกำลังแก้ไขอยู่ไหมคะ?
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-col items-center justify-center min-w-[3rem] text-gray-400">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mb-1 group-hover:text-blue-500 transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.286 3.423.379.35.028.71.042 1.05.042.34 0 .699-.012 1.05-.042 1.153-.094 2.294-.213 3.423-.379 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
           </svg>
           <span className="text-xs font-semibold">{replies}</span>
        </div>
      </div>
    </Link>
  );
}
