import Link from 'next/link';

export default function PostButton() {
  return (
    <Link 
      href="/create-topic"
      className="fixed z-40 bottom-8 right-8 w-14 h-14 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center group"
      aria-label="Create Post"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    </Link>
  );
}
