import { useState, useEffect } from 'react';
import ScrollReveal from './ScrollReveal';

interface StorySectionProps {
  docId: string;
  fallbackText: string;
}

const StorySection = ({ docId, fallbackText }: StorySectionProps) => {
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const hasDoc = docId && docId !== 'PASTE_YOUR_DOC_ID_HERE';

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      setError('');

      if (!hasDoc) {
        setContent(fallbackText);
        const firstLines = fallbackText.split('\n').filter(Boolean).slice(0, 2).join(' ');
        setPreview(firstLines);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://docs.google.com/document/d/${docId}/export?format=txt`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        
        if (text && text.trim()) {
          setContent(text);
          const firstLines = text.split('\n').filter(Boolean).slice(0, 2).join(' ');
          setPreview(firstLines);
        } else {
          throw new Error('Doküman boş veya okunamıyor');
        }
      } catch (err) {
        console.warn('Google Docs yüklenemedi, yedek içerik kullanılıyor:', err);
        setError('Google Docs\'tan yüklenemedi, yedek içerik gösteriliyor.');
        setContent(fallbackText);
        const firstLines = fallbackText.split('\n').filter(Boolean).slice(0, 2).join(' ');
        setPreview(firstLines);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [docId, hasDoc, fallbackText]);

  const toggleExpanded = () => {
    setExpanded(!expanded);
    
    // Refresh ScrollTrigger after state change
    setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).ScrollTrigger) {
        (window as any).ScrollTrigger.refresh();
      }
    }, 100);
  };

  if (loading) {
    return (
      <div className="bg-stone-900/50 rounded-2xl p-8 md:p-12 shadow-2xl backdrop-blur-sm border border-stone-800" data-testid="story-loading">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-stone-400">Hikaye yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-900/50 rounded-2xl p-8 md:p-12 shadow-2xl backdrop-blur-sm border border-stone-800" data-testid="story-container">
      {error && (
        <div className="mb-4 p-3 bg-yellow-900/50 border border-yellow-600 rounded-lg text-yellow-200 text-sm" data-testid="story-error">
          {error}
        </div>
      )}
      
      <div className="scroll-reveal-container">
        <ScrollReveal
          baseOpacity={0.05}
          baseRotation={5}
          blurStrength={2}
          containerClassName="text-white"
          textClassName="text-lg md:text-xl leading-relaxed text-stone-200"
        >
          {expanded ? content : preview + '...'}
        </ScrollReveal>
      </div>
      
      <div className="mt-8 text-center">
        <button 
          onClick={toggleExpanded}
          className="inline-flex items-center px-8 py-3 bg-transparent border-2 border-red-600 text-red-600 font-bold rounded-full hover:bg-red-600 hover:text-white transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-600/20"
          data-testid="button-toggle-story"
        >
          <span data-testid="text-button-label">
            {expanded ? 'GİZLE' : 'DEVAMINI OKU'}
          </span>
          <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default StorySection;
