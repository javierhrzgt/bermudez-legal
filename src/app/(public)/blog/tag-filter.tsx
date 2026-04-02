'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Tag, X } from 'lucide-react';

export default function TagFilter({ allTags, activeTag }: { allTags: string[]; activeTag: string | null }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectTag = (tag: string | null) => {
    setOpen(false);
    if (tag) {
      router.push(`/blog?tag=${encodeURIComponent(tag)}`);
    } else {
      router.push('/blog');
    }
  };

  if (allTags.length === 0) return null;

  return (
    <div className="mb-10 flex flex-wrap items-center gap-3">
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-primary-300 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Tag className="h-4 w-4 text-primary-600" />
          <span>{activeTag ? activeTag : 'Filtrar por tema'}</span>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="absolute z-20 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg py-1 max-h-72 overflow-y-auto">
            <button
              onClick={() => selectTag(null)}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                !activeTag ? 'bg-primary-50 text-primary-800 font-medium' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Todos los temas
            </button>
            <div className="border-t border-gray-100 my-1" />
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => selectTag(tag)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  activeTag === tag ? 'bg-primary-50 text-primary-800 font-medium' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {activeTag && (
        <button
          onClick={() => selectTag(null)}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary-50 text-primary-700 rounded-xl text-sm font-medium hover:bg-primary-100 transition-colors"
        >
          <span>{activeTag}</span>
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
