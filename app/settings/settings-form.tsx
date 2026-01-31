'use client';

import { useActionState, useState, useRef } from 'react';
import { updateProfile, deleteAccount } from '@/app/lib/actions/settings';
import Link from 'next/link';
import Image from 'next/image';

interface SettingsFormProps {
  user: {
    name: string;
    email: string;
    avatarUrl?: string; // Add avatarUrl
  };
}

export default function SettingsForm({ user }: SettingsFormProps) {
  const [updateState, updateAction, isUpdating] = useActionState(updateProfile, undefined);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user.avatarUrl || null);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [deleteState, deleteAction, isDeleting] = useActionState(async () => {
    return await deleteAccount();
  }, undefined);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("ไฟล์ขนาดใหญ่เกินไป (สูงสุด 5MB)");
        return;
      }
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setImageError(false); // Reset error on new select
    }
  };

  const initialInitials = user.name
    ? user.name.charAt(0).toUpperCase()
    : user.email.charAt(0).toUpperCase();

  return (
    <>
      <form action={updateAction} className="space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center gap-6">
            <div className="relative group">
                <div className="relative w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                    {previewUrl && !imageError ? (
                        <Image 
                            src={previewUrl} 
                            alt="Profile" 
                            className="object-cover"
                            fill
                            sizes="96px"
                            unoptimized
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <span className="text-3xl font-medium text-gray-500">{initialInitials}</span>
                    )}
                </div>
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-1.5 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-600">
                        <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                    </svg>
                </button>
            </div>
            
            <div className="flex-1">
                <label className="block text-sm font-medium text-gray-900 mb-1">รูปโปรไฟล์</label>
                <div className="text-xs text-gray-500 mb-3">
                    อัปโหลดรูปภาพ JPG, GIF หรือ PNG ขนาดไม่เกิน 5MB
                </div>
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm font-medium text-black border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    เลือกรูปภาพ
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef}
                    name="avatar"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            อีเมล (เปลี่ยนไม่ได้)
          </label>
          <input
            type="email"
            id="email"
            value={user.email}
            disabled
            className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
          />
        </div>

        <div>
           <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            ชื่อที่ใช้แสดง
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={user.name}
            required
            minLength={2}
            maxLength={50}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-black focus:border-black outline-none transition-all"
          />
           {updateState?.errors?.name && (
              <p className="text-red-500 text-xs mt-1">{updateState.errors.name}</p>
            )}
        </div>

        {/* Generic Error Message */}
        {updateState?.message && !updateState.success && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {updateState.message}
            </div>
        )}
        
        {/* Success Message */}
        {updateState?.success && (
            <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                {updateState.message}
            </div>
        )}

        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
           <button
            type="submit"
            disabled={isUpdating}
            className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
           >
             {isUpdating ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
           </button>
           
           <Link href="/" className="text-gray-500 text-sm hover:text-gray-900">
             ยกเลิก
           </Link>
        </div>
      </form>

      <div className="mt-12 pt-8 border-t border-gray-100">
        <h3 className="text-lg font-medium text-red-600 mb-2">โซนอันตราย</h3>
        <p className="text-sm text-gray-500 mb-4">
          การลบบัญชีจะไม่สามารถกู้คืนได้ ข้อมูลทั้งหมดของคุณจะถูกลบออกจากระบบ
        </p>
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
        >
          ลบบัญชีผู้ใช้
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in fade-in zoom-in-95 duration-200">
             <h3 className="text-lg font-bold text-gray-900 mb-2">ยืนยันการลบบัญชี?</h3>
             <p className="text-sm text-gray-500 mb-6">
               คุณแน่ใจหรือไม่ว่าต้องการลบบัญชี? การกระทำนี้ไม่สามารถย้อนกลับได้
             </p>
             
             {deleteState?.message && (
                 <p className="text-red-600 text-sm mb-4">{deleteState.message}</p>
             )}

             <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  ยกเลิก
                </button>
                <form action={deleteAction}>
                    <button
                      type="submit"
                      disabled={isDeleting}
                      className="px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isDeleting ? 'กำลังลบ...' : 'ยืนยันลบบัญชี'}
                    </button>
                </form>
             </div>
          </div>
        </div>
      )}
    </>
  );
}
