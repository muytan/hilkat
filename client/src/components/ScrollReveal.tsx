import { useEffect, useRef, useMemo } from 'react';

interface ScrollRevealProps {
  children: string;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
}

const ScrollReveal = ({
  children,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = "",
  textClassName = "",
  rotationEnd = "bottom bottom",
  wordAnimationEnd = "bottom bottom"
}: ScrollRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split(/(\s+|\n)/).map((word, index) => {
      if (word.match(/^\s+$/) || word === '\n') return word;
      return (
        <span className="word inline-block" key={index}>
          {word}
        </span>
      );
    });
  }, [children]);

  useEffect(() => {
    const initAnimation = () => {
      const gsap = (window as any).gsap;
      const ScrollTrigger = (window as any).ScrollTrigger;
      
      if (!gsap || !ScrollTrigger) {
        console.error('GSAP or ScrollTrigger not loaded.');
        return;
      }

      gsap.registerPlugin(ScrollTrigger);

      const el = containerRef.current;
      if (!el) return;

      // Container rotation animation
      gsap.fromTo(
        el,
        { transformOrigin: '0% 50%', rotate: baseRotation },
        {
          ease: 'none',
          rotate: 0,
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            refreshPriority: -1
          },
        }
      );

      const wordElements = el.querySelectorAll('.word');
      
      if (wordElements.length > 0) {
        // Words opacity animation
        gsap.fromTo(
          wordElements,
          { opacity: baseOpacity },
          {
            ease: 'none',
            opacity: 1,
            stagger: 0.08,
            scrollTrigger: {
              trigger: el,
              start: 'top bottom-=50px',
              end: 'top center-=100px',
              scrub: 1,
              refreshPriority: -1
            },
          }
        );

        // Words blur animation
        if (enableBlur) {
          gsap.fromTo(
            wordElements,
            { filter: `blur(${blurStrength}px)` },
            {
              ease: 'none',
              filter: 'blur(0px)',
              stagger: 0.08,
              scrollTrigger: {
                trigger: el,
                start: 'top bottom-=50px',
                end: 'top center-=100px',
                scrub: 1,
                refreshPriority: -1
              },
            }
          );
        }
      }

      return () => {
        if (ScrollTrigger) {
          ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
        }
      };
    };

    // Check if GSAP is loaded, if not wait for it
    if (typeof (window as any).gsap !== 'undefined') {
      initAnimation();
    } else {
      const checkGsap = setInterval(() => {
        if (typeof (window as any).gsap !== 'undefined') {
          clearInterval(checkGsap);
          initAnimation();
        }
      }, 100);
      
      // Cleanup interval after 5 seconds if GSAP still not loaded
      setTimeout(() => {
        clearInterval(checkGsap);
      }, 5000);
    }
  }, [enableBlur, baseRotation, baseOpacity, blurStrength]);

  return (
    <div ref={containerRef} className={`scroll-reveal ${containerClassName}`} data-testid="scroll-reveal-container">
      <div className={`scroll-reveal-text ${textClassName}`} data-testid="scroll-reveal-text">
        {splitText}
      </div>
    </div>
  );
};

export default ScrollReveal;
