'use client';

import { useState, useRef, useEffect, useMemo } from 'react';

interface Category {
  id: string;
  name: string;
  count?: number;
}

interface CategoryComboboxProps {
  categories: Category[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function CategoryCombobox({ categories, value, onChange, error }: CategoryComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter categories based on input (using useMemo instead of useEffect)
  const filteredCategories = useMemo(() => {
    if (inputValue.trim() === '') {
      return categories;
    }
    return categories.filter(cat =>
      cat.name.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [inputValue, categories]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  const handleSelectCategory = (categoryName: string) => {
    setInputValue(categoryName);
    onChange(categoryName);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder="พิมพ์หรือเลือกหมวดหมู่..."
          className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-base"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">
          {filteredCategories.length > 0 ? (
            <>
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 sticky top-0">
                หมวดหมู่ยอดนิยม
              </div>
              {filteredCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleSelectCategory(category.name)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between group"
                >
                  <span className="text-sm font-medium text-gray-900">{category.name}</span>
                  {category.count !== undefined && category.count > 0 && (
                    <span className="text-xs text-gray-400 group-hover:text-gray-600">
                      {category.count} กระทู้
                    </span>
                  )}
                </button>
              ))}
            </>
          ) : (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-gray-500 mb-2">ไม่พบหมวดหมู่ที่ตรงกัน</p>
              <p className="text-xs text-gray-400">
                พิมพ์ &quot;<span className="font-medium text-gray-600">{inputValue}</span>&quot; เพื่อสร้างหมวดหมู่ใหม่
              </p>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}
