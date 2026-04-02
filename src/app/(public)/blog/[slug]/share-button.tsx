'use client';

import { Share2, Check } from "lucide-react";
import { useState } from "react";

export default function ShareButton({ title }: { title: string }) {
  const [status, setStatus] = useState<'idle' | 'shared' | 'copied'>('idle');

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';

    // Try native share API first (works on mobile and some desktop browsers over HTTPS)
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url });
        setStatus('shared');
        setTimeout(() => setStatus('idle'), 2500);
        return;
      } catch {
        // User cancelled or API failed — fall through to clipboard
      }
    }

    // Fallback: copy link to clipboard
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      } else {
        // Final fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setStatus('copied');
      setTimeout(() => setStatus('idle'), 2500);
    } catch {
      console.log('Could not copy to clipboard');
    }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 text-primary-700 hover:text-primary-800 font-medium transition-colors bg-primary-50 hover:bg-primary-100 px-4 py-2 rounded-full text-sm"
    >
      {status === 'copied' ? (
        <>
          <Check className="h-4 w-4 text-green-600" />
          <span className="text-green-600">¡Enlace copiado!</span>
        </>
      ) : status === 'shared' ? (
        <>
          <Check className="h-4 w-4 text-green-600" />
          <span className="text-green-600">¡Compartido!</span>
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          <span>Compartir</span>
        </>
      )}
    </button>
  );
}
