'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSlide {
  _id: string;
  type: 'image' | 'video';
  src: string;
  headline: string;
  subheadline: string;
  cta: string;
  ctaLink: string;
  active: boolean;
  order: number;
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    _id: 'default-1',
    type: 'image',
    src: '',
    headline: 'Raw Honey.\nReal Nature.',
    subheadline: 'Crafted from the wild, delivered with purity. The slow, viscous flow of nature\'s finest liquid gold.',
    cta: 'EXPLORE COLLECTION',
    ctaLink: '/shop',
    active: true,
    order: 0,
  },
  {
    _id: 'default-2',
    type: 'image',
    src: '',
    headline: 'Highland Reserve\nHarvest 2024.',
    subheadline: 'Single-origin wildflower honey from the crystalline slopes of the Scottish Highlands.',
    cta: 'SHOP HIGHLAND HONEY',
    ctaLink: '/shop',
    active: true,
    order: 1,
  },
  {
    _id: 'default-3',
    type: 'image',
    src: '',
    headline: 'Rare Leatherwood.\nTasmania.',
    subheadline: 'Deep in the UNESCO World Heritage rainforest — a complex spicy-sweet character found nowhere else.',
    cta: 'DISCOVER LEATHERWOOD',
    ctaLink: '/shop',
    active: true,
    order: 2,
  },
];

const OVERLAY_COLORS = [
  'linear-gradient(135deg, rgba(61,31,13,0.82) 0%, rgba(92,51,23,0.55) 60%, rgba(0,0,0,0.3) 100%)',
  'linear-gradient(135deg, rgba(20,15,10,0.80) 0%, rgba(61,31,13,0.50) 60%, rgba(0,0,0,0.2) 100%)',
  'linear-gradient(135deg, rgba(42,21,10,0.85) 0%, rgba(92,51,23,0.45) 60%, rgba(0,0,0,0.25) 100%)',
];

const PLACEHOLDER_BG = ['#3D1F0D', '#2A150A', '#1A0F0A'];

export default function HeroCarousel() {
  const [slides, setSlides] = useState<HeroSlide[]>(DEFAULT_SLIDES);
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch slides from DB
  useEffect(() => {
    fetch('/api/hero')
      .then(r => r.json())
      .then((data: HeroSlide[]) => {
        if (Array.isArray(data) && data.filter(s => s.active).length > 0) {
          setSlides(data.filter(s => s.active).sort((a, b) => a.order - b.order));
        }
      })
      .catch(() => {});
  }, []);

  const goTo = useCallback((idx: number, dir: 'left' | 'right' = 'right') => {
    if (animating || idx === current) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 420);
  }, [animating, current]);

  const prev = useCallback(() => {
    goTo(current === 0 ? slides.length - 1 : current - 1, 'left');
  }, [current, slides.length, goTo]);

  const next = useCallback(() => {
    goTo(current === slides.length - 1 ? 0 : current + 1, 'right');
  }, [current, slides.length, goTo]);

  // Auto-play
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent(c => (c === slides.length - 1 ? 0 : c + 1));
    }, 5500);
  }, [slides.length]);

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTimer]);

  // Pause on hover
  const pauseTimer = () => { if (timerRef.current) clearInterval(timerRef.current); };
  const resumeTimer = () => startTimer();

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [prev, next]);

  // Touch swipe
  const touchStart = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const delta = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) { delta > 0 ? next() : prev(); }
    touchStart.current = null;
  };

  const slide = slides[current];
  const hasMedia = slide.src && slide.src.length > 0;

  return (
    <section
      style={{ position: 'relative', width: '100%', height: 'clamp(480px, 85vh, 860px)', overflow: 'hidden', backgroundColor: PLACEHOLDER_BG[current % PLACEHOLDER_BG.length] }}
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-label="Hero carousel"
    >
      {/* Background layers */}
      {slides.map((s, i) => (
        <div
          key={s._id}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            opacity: i === current ? 1 : 0,
            transition: animating ? 'none' : 'opacity 0.7s ease',
            backgroundColor: PLACEHOLDER_BG[i % PLACEHOLDER_BG.length],
          }}
        >
          {/* Media */}
          {s.src && s.type === 'image' && (
            <Image
              src={s.src}
              alt={s.headline}
              fill
              priority={i === 0}
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              sizes="100vw"
            />
          )}
          {s.src && s.type === 'video' && (
            <video
              src={s.src}
              autoPlay
              muted
              loop
              playsInline
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
          {/* Placeholder when no media */}
          {!s.src && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 8%', overflow: 'hidden' }}>
              <div style={{ fontSize: 'clamp(8rem, 20vw, 18rem)', opacity: 0.18, userSelect: 'none', lineHeight: 1 }}>🍯</div>
            </div>
          )}
          {/* Dark gradient overlay */}
          <div style={{ position: 'absolute', inset: 0, background: OVERLAY_COLORS[i % OVERLAY_COLORS.length] }} />
        </div>
      ))}

      {/* Slide content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '0 clamp(1.5rem, 8vw, 7rem)',
        }}
      >
        <div
          style={{
            maxWidth: '640px',
            transform: animating
              ? `translateX(${direction === 'right' ? '-3rem' : '3rem'})`
              : 'translateX(0)',
            opacity: animating ? 0 : 1,
            transition: 'transform 0.42s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.42s ease',
          }}
        >
          {/* Badge */}
          <span style={{
            display: 'inline-block',
            border: '1px solid rgba(196,168,130,0.6)',
            fontFamily: 'Helvetica Neue, Arial, sans-serif',
            fontSize: '0.6rem',
            letterSpacing: '0.18em',
            color: '#C4A882',
            padding: '5px 14px',
            marginBottom: '1.5rem',
          }}>
            NEW HARVEST 2024
          </span>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)',
            lineHeight: '1.08',
            color: '#FAF8F4',
            whiteSpace: 'pre-line',
          }}>
            {slide.headline || 'Raw Honey.\nReal Nature.'}
          </h1>

          {/* Divider */}
          <div style={{ width: '50px', height: '2px', backgroundColor: '#A0622A', margin: '1.5rem 0' }} />

          {/* Subheadline */}
          <p style={{
            fontFamily: 'Helvetica Neue, Arial, sans-serif',
            fontSize: 'clamp(0.78rem, 1.5vw, 0.92rem)',
            color: '#C4A882',
            lineHeight: '1.75',
            maxWidth: '480px',
          }}>
            {slide.subheadline || 'Crafted from the wild, delivered with purity.'}
          </p>

          {/* CTA */}
          <Link href={slide.ctaLink || '/shop'}>
            <button
              type="button"
              style={{
                backgroundColor: '#FAF8F4',
                color: '#3D1F0D',
                fontFamily: 'Helvetica Neue, Arial, sans-serif',
                fontSize: '0.7rem',
                letterSpacing: '0.14em',
                padding: '14px 36px',
                border: 'none',
                cursor: 'pointer',
                marginTop: '2rem',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#F0E8DA'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FAF8F4'; }}
            >
              {slide.cta || 'EXPLORE COLLECTION'} →
            </button>
          </Link>
        </div>
      </div>

      {/* Prev / Next arrows */}
      <button
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        style={{
          position: 'absolute',
          left: 'clamp(0.75rem, 2vw, 2rem)',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          width: '48px',
          height: '48px',
          backgroundColor: 'rgba(250,248,244,0.12)',
          border: '1px solid rgba(250,248,244,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backdropFilter: 'blur(4px)',
          transition: 'background-color 0.2s ease',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(250,248,244,0.24)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(250,248,244,0.12)'; }}
      >
        <ChevronLeft size={20} color="#FAF8F4" />
      </button>

      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        style={{
          position: 'absolute',
          right: 'clamp(0.75rem, 2vw, 2rem)',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          width: '48px',
          height: '48px',
          backgroundColor: 'rgba(250,248,244,0.12)',
          border: '1px solid rgba(250,248,244,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backdropFilter: 'blur(4px)',
          transition: 'background-color 0.2s ease',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(250,248,244,0.24)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(250,248,244,0.12)'; }}
      >
        <ChevronRight size={20} color="#FAF8F4" />
      </button>

      {/* Dot indicators */}
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
        }}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i, i > current ? 'right' : 'left')}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width: i === current ? '28px' : '8px',
              height: '8px',
              borderRadius: i === current ? '4px' : '50%',
              backgroundColor: i === current ? '#FAF8F4' : 'rgba(250,248,244,0.4)',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              transition: 'all 0.35s ease',
            }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '3px',
          backgroundColor: 'rgba(250,248,244,0.15)',
          zIndex: 20,
        }}
      >
        <div
          key={current}
          style={{
            height: '100%',
            backgroundColor: '#A0622A',
            animation: 'heroProgress 5.5s linear forwards',
          }}
        />
      </div>

      {/* Slide counter */}
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          right: 'clamp(1rem, 4vw, 3rem)',
          zIndex: 20,
          fontFamily: 'Helvetica Neue, Arial, sans-serif',
          fontSize: '0.65rem',
          letterSpacing: '0.1em',
          color: 'rgba(250,248,244,0.5)',
        }}
      >
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>

      {/* CSS animation for progress bar */}
      <style>{`
        @keyframes heroProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}
