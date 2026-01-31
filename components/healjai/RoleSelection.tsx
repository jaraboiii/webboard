'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { joinHealjai, checkMatchStatus } from '../../app/healjai/actions';

export default function RoleSelection() {
  const [name, setName] = useState('');
  const [role, setRole] = useState<'suffering' | 'healing'>('suffering');
  const [isLoading, setIsLoading] = useState(false); // Used for "Form Submitting" state
  const [isSearching, setIsSearching] = useState(false); // Used for "Matching" state
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  // Polling for match
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSearching && userId) {
      interval = setInterval(async () => {
        const status = await checkMatchStatus(userId);
        if (status.matched && status.roomId) {
           router.push(`/healjai/chat/${status.roomId}?userId=${userId}`);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isSearching, userId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('role', role);

    try {
      const result = await joinHealjai(null, formData);
      if (result.error) {
        setError(result.error);
        setIsLoading(false);
      } else if (result.success && result.userId) {
        setUserId(result.userId);
        setIsSearching(true);
        // Keep loading state true visually or switch to searching UI
      }
    } catch {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่');
      setIsLoading(false);
    }
  };

  if (isSearching) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center max-w-2xl mx-auto shadow-sm min-h-[400px] flex flex-col items-center justify-center">
        <div className="mb-6 relative">
             <div className="w-16 h-16 border-4 border-gray-100 border-t-yellow-400 rounded-full animate-spin"></div>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">กำลังค้นหากระทู้ที่เหมาะสม...</h2>
        <p className="text-gray-500">
          ระบบกำลังจับคู่คุณกับสมาชิกท่านอื่น {role === 'suffering' ? 'เพื่อรับฟังเรื่องราวของคุณ' : 'ที่ต้องการกำลังใจจากคุณ'}
        </p>
        <div className="mt-8 flex gap-2 justify-center">
            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-75"></span>
            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-150"></span>
            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-300"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {/* Card Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
           <h1 className="text-lg font-bold text-gray-900">เริ่มการสนทนาใหม่ (Healjai Mode)</h1>
           <p className="text-sm text-gray-500 mt-1">
             เข้าสู่ห้องสนทนาแบบไม่เปิดเผยตัวตน เลือกบทบาทที่คุณสะดวกใจ
           </p>
        </div>

        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                นามแฝงของคุณ
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all placeholder-gray-400"
                placeholder="ระบุชื่อที่ต้องการให้แสดง..."
              />
            </div>

            {/* Role Selection - Card Style */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                เลือกหัวข้อการสนทนา
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('suffering')}
                  className={`relative p-6 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                    role === 'suffering'
                      ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
                      : 'border-gray-200 hover:border-blue-200 bg-white'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl mb-3 ${role==='suffering' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>🌧️</div>
                  <h3 className={`font-bold ${role === 'suffering' ? 'text-blue-700' : 'text-gray-900'}`}>ทุกข์ใจ / ระบาย</h3>
                  <p className="text-sm text-gray-500 mt-1">ต้องการพื้นที่ระบายความในใจ หาคนรับฟังปัญหา</p>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('healing')}
                  className={`relative p-6 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                    role === 'healing'
                      ? 'border-yellow-500 bg-yellow-50/50 ring-1 ring-yellow-500'
                      : 'border-gray-200 hover:border-yellow-200 bg-white'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl mb-3 ${role==='healing' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-500'}`}>☀️</div>
                  <h3 className={`font-bold ${role === 'healing' ? 'text-yellow-700' : 'text-gray-900'}`}>สุขใจ / ผู้ฟัง</h3>
                  <p className="text-sm text-gray-500 mt-1">พร้อมเป็นผู้ฟังที่ดี ให้กำลังใจเพื่อนมนุษย์</p>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-sm transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-base"
            >
              {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เริ่มต้นการสนทนา'}
            </button>
          </form>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>การสนทนาของคุณจะเป็นความลับและไม่ถูกบันทึกถาวร</p>
      </div>
    </div>
  );
}
