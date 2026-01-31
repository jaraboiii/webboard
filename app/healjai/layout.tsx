
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';


export default function HealjaiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-900 font-sans">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="hidden md:block">
            <Sidebar />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
             {/* Optional Banner if needed, or maybe just purely content */}
            {children}
          </div>

        </div>
      </main>
    </div>
  );
}
