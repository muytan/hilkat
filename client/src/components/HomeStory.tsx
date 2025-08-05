import { useState, useEffect } from 'react';
import ScrollReveal from './ScrollReveal';

interface HomeStoryProps {
  docId: string;
  fallbackText: string;
}

const HomeStory = ({ docId, fallbackText }: HomeStoryProps) => {
  const [content, setContent] = useState('');
  const [firstSentence, setFirstSentence] = useState('');
  const [storyTitle, setStoryTitle] = useState('');
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
        const lines = fallbackText.split('\n').filter(Boolean);
        setFirstSentence(lines.slice(0, 2).join('\n'));
        setStoryTitle('Yargıç Erkan Cantay');
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
          const lines = text.split('\n').filter(Boolean);
          
          // Extract title (usually first line or after "# ")
          let title = '';
          let contentLines = lines;
          const firstLine = lines[0];
          
          if (firstLine.startsWith('# ')) {
            title = firstLine.replace('# ', '').trim();
            // Remove title from content
            contentLines = lines.slice(1).filter(Boolean);
          } else if (firstLine.toLowerCase().includes('hilkat garibesi')) {
            // If first line contains the site title, use it as story title and remove from content
            title = firstLine.trim();
            contentLines = lines.slice(1).filter(Boolean);
          } else {
            // If no markdown title, use first few words as title
            title = firstLine.split(' ').slice(0, 4).join(' ') + '...';
          }
          
          setContent(contentLines.join('\n'));
          setFirstSentence(contentLines.slice(0, 2).join('\n'));
          setStoryTitle(title);
        } else {
          throw new Error('Doküman boş veya okunamıyor');
        }
      } catch (err) {
        console.warn('Google Docs yüklenemedi, yedek içerik kullanılıyor:', err);
        setError('Google Docs\'tan yüklenemedi, yedek içerik gösteriliyor.');
        setContent(fallbackText);
        const lines = fallbackText.split('\n').filter(Boolean);
        setFirstSentence(lines.slice(0, 2).join('\n'));
        setStoryTitle('Yargıç Erkan Cantay');
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
      <div className="text-center py-20" data-testid="story-loading">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-stone-400">Hikaye yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="py-20" data-testid="home-story-container">
      {error && (
        <div className="mb-8 p-3 bg-yellow-900/50 border border-yellow-600 rounded-lg text-yellow-200 text-sm max-w-4xl mx-auto" data-testid="story-error">
          {error}
        </div>
      )}
      <div className="scroll-reveal-container max-w-4xl mx-auto">
        {/* Story Title */}
        {storyTitle && (
          <h2 className="text-2xl md:text-3xl text-red-500 mb-8 text-center font-medium" style={{ fontFamily: 'Inter, sans-serif' }} data-testid="story-title">
            {storyTitle}
          </h2>
        )}
        
        <ScrollReveal
          baseOpacity={0.05}
          baseRotation={3}
          blurStrength={8}
          containerClassName="text-white"
          textClassName="text-xl md:text-2xl leading-relaxed text-stone-200 whitespace-pre-line"
        >
          {expanded ? content : firstSentence}
        </ScrollReveal>
        
        {!expanded && (
          <div className="mt-8 text-center">
            <button 
              onClick={toggleExpanded}
              className="inline-flex items-center px-8 py-3 bg-transparent border-2 border-red-600 text-red-600 font-bold rounded-full hover:bg-red-600 hover:text-white transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-600/20"
              data-testid="button-read-more"
            >
              <span data-testid="text-read-more">
                DEVAMINI OKU
              </span>
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeStory;