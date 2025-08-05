import { useEffect } from 'react';
import HomeStory from '@/components/HomeStory';

const Home = () => {
  const docId = '1buswkmc-GV0ZQLM8W_I0aPpYbOwjD7Ia';
  const fallbackText = `"Sayın Yargıç Erkan Cantay!". Yargıç içeri girdiğinde herkes ayağa kalktı… 'o' dışında.

Avukatı dürttüğünde ayağa kalkmaya yeltendi ancak yargıç çoktan oturmuştu.

Bir süre sessizlikten sonra herkes yargıcın tiksinmiş suratına odaklanmıştı. Sanığa bakıyordu, bu kadar nefreti belki de hayatı boyunca hissetmemişti.

Kızına ne kadar sevgi duyuyorsa ve kızı için nasıl her şeyi yapabilecekse; karşındaki seri katile de o kadar büyük ve derin bir nefret duyuyordu.

Ön yargılı görüşlerini bir kenara koymaya çalışarak ilk sözlerini söyledi:

"Evet, başlayalım…"`;

  useEffect(() => {
    // Initialize GSAP animations after component mount
    const initAnimations = () => {
      if (typeof (window as any).gsap === 'undefined') return;
      
      const gsap = (window as any).gsap;
      const ScrollTrigger = (window as any).ScrollTrigger;
      
      if (ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
      }
      
      gsap.from('[data-testid="hero-title"] > div', {
        duration: 1.5,
        y: 100,
        opacity: 0,
        stagger: 0.3,
        ease: 'power3.out',
        delay: 0.5
      });
    };

    // Wait for GSAP to load
    if (typeof (window as any).gsap !== 'undefined') {
      initAnimations();
    } else {
      const checkGsap = setInterval(() => {
        if (typeof (window as any).gsap !== 'undefined') {
          clearInterval(checkGsap);
          initAnimations();
        }
      }, 100);
    }
  }, []);

  return (
    <div className="bg-black text-white font-sans antialiased">
      {/* Top Category Label */}
      <div className="text-center py-4 bg-black" data-testid="category-label">
        <p className="text-stone-500 text-sm md:text-base font-medium tracking-widest uppercase">
          KISA KORKU HİKAYELERİ
        </p>
      </div>

      {/* Hero Section */}
      <header className="relative min-h-screen flex flex-col justify-center items-center text-center horror-bg overflow-hidden" data-testid="hero-section">
        

        
        {/* Main Title */}
        <div className="z-10 px-6">
          <h1 className="font-serif font-black tracking-wider mb-6" data-testid="hero-title" style={{ fontFamily: 'Playfair Display, serif' }}>
            <div className="text-7xl md:text-9xl text-white">HİLKAT</div>
            <div className="text-7xl md:text-9xl text-red-600">GARİBESİ</div>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-stone-400 font-medium tracking-wide" data-testid="hero-subtitle">
            SON HİKAYEYİ OKU
          </p>
          
          {/* Scroll Indicator */}
          <div className="mt-16" data-testid="scroll-indicator">
            <svg className="w-6 h-6 mx-auto animate-bounce text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </header>

      {/* Story Section */}
      <main className="px-6 -mt-20" data-testid="main-content">
        <HomeStory docId={docId} fallbackText={fallbackText} />
      </main>

      {/* Footer */}
      <footer className="text-center py-20 border-t border-stone-800 mt-40" data-testid="footer">
        <p className="text-stone-500 text-sm" data-testid="text-copyright">
          © 2025 Hilkat Garibesi. Tüm hakları saklıdır.
        </p>
      </footer>
    </div>
  );
};

export default Home;
