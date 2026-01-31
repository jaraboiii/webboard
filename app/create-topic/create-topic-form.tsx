'use client';

import { useActionState, useState } from 'react';
import { createTopic } from '@/app/lib/actions/topic';
import { useRouter } from 'next/navigation';
import CategoryCombobox from '@/components/ui/CategoryCombobox';

interface Category {
  id: string;
  name: string;
  count?: number;
}

interface CreateTopicFormProps {
  categories: Category[];
}

export default function CreateTopicForm({ categories }: CreateTopicFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createTopic, undefined);
  const [categoryValue, setCategoryValue] = useState(categories[0]?.name || '');

  return (
    <form action={formAction} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
          หัวข้อกระทู้ <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          minLength={5}
          maxLength={100}
          placeholder="เช่น: วิธีแก้ปัญหา... (ใช้ # เพื่อเพิ่ม hashtag)"
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-base"
        />
        {state?.errors?.title && (
          <p className="text-red-500 text-sm mt-2">{state.errors.title}</p>
        )}
        <p className="text-xs text-gray-500 mt-1.5">
          💡 ใช้ <span className="font-mono bg-gray-100 px-1 py-0.5 rounded">#</span> เพื่อเพิ่ม hashtag ในหัวข้อ เช่น #JavaScript #Tutorial
        </p>
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-2">
          หมวดหมู่ <span className="text-red-500">*</span>
        </label>
        <input type="hidden" name="category" value={categoryValue} />
        <CategoryCombobox
          categories={categories}
          value={categoryValue}
          onChange={setCategoryValue}
          error={state?.errors?.category?.[0]}
        />
        <p className="text-xs text-gray-500 mt-1.5">
          เลือกจากยอดนิยม หรือพิมพ์ชื่อหมวดหมู่ใหม่
        </p>
      </div>

      {/* Content */}
      <div>
        <label htmlFor="content" className="block text-sm font-semibold text-gray-900 mb-2">
          เนื้อหา <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          required
          minLength={10}
          rows={12}
          placeholder="เขียนรายละเอียด ถามคำถาม หรือแบ่งปันประสบการณ์...&#10;&#10;💡 สามารถใช้ # เพื่อเพิ่ม hashtag ในเนื้อหาได้"
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none text-base font-normal"
        />
        {state?.errors?.content && (
          <p className="text-red-500 text-sm mt-2">{state.errors.content}</p>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-blue-900 mb-1">เกี่ยวกับ Hashtags (#)</h4>
            <p className="text-xs text-blue-700 leading-relaxed">
              Hashtags จะช่วยให้กระทู้ของคุณถูกค้นพบได้ง่ายขึ้น และจะแสดงใน &quot;# ประจำวัน&quot; หากได้รับความนิยม
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {state?.message && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
          {state.message}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 bg-black text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              กำลังโพส...
            </span>
          ) : (
            'โพสกระทู้'
          )}
        </button>
        
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isPending}
          className="px-6 py-3.5 text-gray-600 hover:text-gray-900 font-semibold transition-colors disabled:opacity-50"
        >
          ยกเลิก
        </button>
      </div>
    </form>
  );
}
