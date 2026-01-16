'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

// ESP32 Board Component
const ESP32Board = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 280" className={className} style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.2))' }}>
    <defs>
      <linearGradient id="pcb-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2d5a3d" />
        <stop offset="100%" stopColor="#1a472a" />
      </linearGradient>
    </defs>
    <rect x="10" y="10" width="180" height="260" rx="4" fill="#1a472a" />
    <rect x="14" y="14" width="172" height="252" rx="2" fill="url(#pcb-gradient)" />
    <g stroke="#3d7a52" strokeWidth="0.8" fill="none" opacity="0.7">
      <path d="M30 80 L80 80 L80 120 L120 120" />
      <path d="M100 60 L100 100 L140 100" />
      <path d="M60 180 L60 220 L100 220 L100 200" />
      <path d="M140 160 L140 200 L160 200" />
    </g>
    <rect x="60" y="90" width="80" height="60" rx="3" fill="#0a0a0a" />
    <rect x="63" y="93" width="74" height="54" rx="2" fill="#1a1a1a" />
    <text x="100" y="118" textAnchor="middle" fill="#555" fontSize="7" fontFamily="monospace" fontWeight="600">ESP32</text>
    <text x="100" y="130" textAnchor="middle" fill="#444" fontSize="5" fontFamily="monospace">WROOM-32</text>
    <rect x="75" y="18" width="50" height="52" rx="3" fill="#0f0f0f" stroke="#333" strokeWidth="1" />
    <rect x="80" y="23" width="40" height="42" rx="2" fill="#1a1a1a" />
    <rect x="82" y="248" width="36" height="16" rx="3" fill="#2a2a2a" />
    <circle cx="35" cy="40" r="5" fill="#059669" opacity="0.8" />
    <circle cx="35" cy="58" r="5" fill="#3b82f6" opacity="0.6" />
    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <circle key={`gpio-l-${i}`} cx="23" cy={85 + i * 11} r="2.5" fill="#d4af37" />
    ))}
    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <circle key={`gpio-r-${i}`} cx="177" cy={85 + i * 11} r="2.5" fill="#d4af37" />
    ))}
  </svg>
);

// Single Curvy Road - responsive for mobile and desktop
const CurvyRoad = ({ isMobile }: { isMobile: boolean }) => (
  <svg 
    viewBox={isMobile ? "0 0 400 800" : "0 0 1200 800"} 
    className="absolute inset-0 w-full h-full" 
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <linearGradient id="road-fill" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#2d5a3d" stopOpacity="0.7" />
        <stop offset="50%" stopColor="#3d6b4d" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#2d5a3d" stopOpacity="0.3" />
      </linearGradient>
    </defs>
    
    {isMobile ? (
      /* Mobile: Vertical curvy road */
      <>
        <path
          d="M200 800
             Q120 700, 200 600
             Q280 500, 200 400
             Q120 300, 200 200
             Q280 100, 200 0"
          fill="none"
          stroke="url(#road-fill)"
          strokeWidth="60"
          strokeLinecap="round"
        />
        <path
          d="M200 800
             Q120 700, 200 600
             Q280 500, 200 400
             Q120 300, 200 200
             Q280 100, 200 0"
          fill="none"
          stroke="#4a9960"
          strokeWidth="62"
          strokeLinecap="round"
          opacity="0.3"
        />
        <path
          d="M200 800
             Q120 700, 200 600
             Q280 500, 200 400
             Q120 300, 200 200
             Q280 100, 200 0"
          fill="none"
          stroke="#5aaa70"
          strokeWidth="2"
          strokeDasharray="15 10"
          strokeLinecap="round"
          opacity="0.7"
        >
          <animate attributeName="stroke-dashoffset" values="0;-25" dur="1s" repeatCount="indefinite" />
        </path>
      </>
    ) : (
      /* Desktop: Horizontal curvy road from left */
      <>
        <path
          d="M-50 650
             Q150 650, 250 500
             Q350 350, 500 400
             Q650 450, 750 300
             Q850 150, 1000 200
             Q1150 250, 1250 100"
          fill="none"
          stroke="url(#road-fill)"
          strokeWidth="70"
          strokeLinecap="round"
        />
        <path
          d="M-50 650
             Q150 650, 250 500
             Q350 350, 500 400
             Q650 450, 750 300
             Q850 150, 1000 200
             Q1150 250, 1250 100"
          fill="none"
          stroke="#4a9960"
          strokeWidth="72"
          strokeLinecap="round"
          opacity="0.3"
        />
        <path
          d="M-50 650
             Q150 650, 250 500
             Q350 350, 500 400
             Q650 450, 750 300
             Q850 150, 1000 200
             Q1150 250, 1250 100"
          fill="none"
          stroke="#5aaa70"
          strokeWidth="3"
          strokeDasharray="20 12"
          strokeLinecap="round"
          opacity="0.7"
        >
          <animate attributeName="stroke-dashoffset" values="0;-32" dur="1s" repeatCount="indefinite" />
        </path>
      </>
    )}
  </svg>
);

// Feature signboards data - positions are responsive
const signboards = [
  { number: '01', title: 'Edge Sensing', desc: 'Industrial-grade precision at 100Hz sampling rate' },
  { number: '02', title: 'Real-time Streaming', desc: 'MQTT protocol with sub-second latency' },
  { number: '03', title: 'ML Intelligence', desc: 'Predict equipment failures 48 hours ahead' },
  { number: '04', title: 'Auto Compliance', desc: 'SPCB, PAT, CBAM reports automated' },
];

// Desktop positions along the road curve
const desktopPositions = [
  { top: '70%', left: '5%', side: 'left' },
  { top: '50%', left: '28%', side: 'right' },
  { top: '35%', left: '52%', side: 'left' },
  { top: '18%', left: '75%', side: 'right' },
];

// Mobile positions along vertical road
const mobilePositions = [
  { top: '70%', left: '55%', side: 'right' },
  { top: '52%', left: '5%', side: 'left' },
  { top: '34%', left: '55%', side: 'right' },
  { top: '16%', left: '5%', side: 'left' },
];

// Signboard component - uniform size, responsive positions
const Signboard = ({ 
  sign, 
  index, 
  progress,
  isMobile
}: { 
  sign: typeof signboards[0]; 
  index: number; 
  progress: number;
  isMobile: boolean;
}) => {
  const positions = isMobile ? mobilePositions : desktopPositions;
  const pos = positions[index];
  const triggerPoint = 0.2 + index * 0.15;
  const isVisible = progress > triggerPoint;
  const cardProgress = isVisible ? Math.min(1, (progress - triggerPoint) * 5) : 0;
  
  return (
    <motion.div
      className="absolute z-20"
      style={{ 
        top: pos.top,
        left: pos.left,
        opacity: cardProgress,
        y: 30 * (1 - cardProgress),
        scale: 0.9 + 0.1 * cardProgress,
      }}
    >
      <div className="bg-surface-elevated/95 backdrop-blur-sm rounded-xl border border-border shadow-lg shadow-ink/5 w-[160px] sm:w-[180px] md:w-[200px] p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] sm:text-xs font-mono text-accent-green bg-accent-green/10 px-1.5 sm:px-2 py-0.5 rounded">
            {sign.number}
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <h3 className="text-xs sm:text-sm font-semibold text-ink mb-1 leading-tight">{sign.title}</h3>
        <p className="text-[10px] sm:text-xs text-ink-muted leading-relaxed">{sign.desc}</p>
      </div>
      {/* Connector dot */}
      <div className={`absolute w-2 h-2 rounded-full bg-accent-green/60 ${pos.side === 'left' ? '-right-3 top-1/2 -translate-y-1/2' : '-left-3 top-1/2 -translate-y-1/2'}`} />
    </motion.div>
  );
};

// Main component
export const InteractiveBoardSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setCurrentProgress(latest);
  });

  // Board animation - responsive for mobile
  const boardScale = useTransform(
    scrollYProgress, 
    [0, 0.08, 0.2], 
    isMobile ? [1, 0.6, 0.3] : [1, 0.7, 0.35]
  );
  const boardX = useTransform(
    scrollYProgress, 
    [0, 0.08, 0.2], 
    isMobile ? ['0%', '0%', '-25%'] : ['0%', '-15%', '-35%']
  );
  const boardY = useTransform(
    scrollYProgress, 
    [0, 0.08, 0.2], 
    isMobile ? ['0%', '-20%', '-35%'] : ['0%', '5%', '20%']
  );
  const boardOpacity = useTransform(scrollYProgress, [0, 0.1, 0.85, 0.95], [1, 1, 1, 0]);
  
  // Road fades in as board moves
  const roadOpacity = useTransform(scrollYProgress, [0.08, 0.18], [0, 1]);
  
  // Headline fades out as we scroll
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.03, 0.1], [0, 1, 0]);

  return (
    <section ref={containerRef} id="features" className="relative h-[400vh] md:h-[450vh]">
      {/* Pinned container */}
      <div className="sticky top-0 h-screen overflow-hidden bg-surface">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <rect width="40" height="40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-ink" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* Curvy Road */}
        <motion.div style={{ opacity: roadOpacity }} className="absolute inset-0 z-10">
          <CurvyRoad isMobile={isMobile} />
        </motion.div>
        
        {/* Signboards along the road */}
        <div className="absolute inset-0 z-20 px-3 md:px-0">
          {signboards.map((sign, index) => (
            <Signboard key={sign.number} sign={sign} index={index} progress={currentProgress} isMobile={isMobile} />
          ))}
        </div>
        
        {/* ESP32 Board - starts center, moves to corner */}
        <motion.div 
          style={{ 
            scale: boardScale, 
            x: boardX, 
            y: boardY, 
            opacity: boardOpacity 
          }}
          className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none will-change-transform"
        >
          {/* Headline */}
          <motion.div style={{ opacity: headlineOpacity }} className="text-center mb-4 md:mb-6 px-4">
            <span className="label-sm text-accent-green mb-2 block text-xs md:text-sm">The Technology</span>
            <h2 className="text-xl md:text-3xl lg:text-4xl font-semibold text-ink">Precision-engineered for Indian industry.</h2>
          </motion.div>
          
          {/* Board */}
          <div className="w-32 sm:w-40 md:w-56 lg:w-64">
            <ESP32Board className="w-full h-auto" />
          </div>
          
          <motion.p style={{ opacity: headlineOpacity }} className="mt-3 md:mt-4 text-xs md:text-sm font-mono text-ink-faint">
            ESP32-based edge sensing
          </motion.p>
        </motion.div>
        
        {/* Section label - appears when road is visible */}
        <motion.div 
          style={{ opacity: useTransform(scrollYProgress, [0.15, 0.25], [0, 1]) }}
          className="absolute top-4 md:top-8 right-4 md:right-8 z-40"
        >
          <span className="text-[10px] md:text-xs font-mono text-ink-faint">Scroll to explore</span>
        </motion.div>
      </div>
    </section>
  );
};