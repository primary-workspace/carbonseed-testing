'use client';

'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

const industries = [
  { name: 'Steel & Foundries', description: 'Furnace monitoring, energy optimization', icon: '🏭' },
  { name: 'Textiles', description: 'Loom efficiency, humidity control', icon: '🧵' },
  { name: 'Food Processing', description: 'Cold chain, quality assurance', icon: '🍱' },
  { name: 'Plastics & Packaging', description: 'Extrusion monitoring, waste reduction', icon: '📦' },
  { name: 'Auto Components', description: 'CNC health, vibration analysis', icon: '⚙️' },
  { name: 'Pharmaceuticals', description: 'GMP compliance, batch tracking', icon: '💊' },
];

const complianceItems = [
  { code: 'SPCB', name: 'State Pollution Control Board', description: 'Continuous emission monitoring' },
  { code: 'PAT', name: 'Perform Achieve Trade', description: 'Energy efficiency certification' },
  { code: 'CBAM', name: 'Carbon Border Adjustment', description: 'EU export readiness' },
];

// Industrial scene SVG - enters small and zooms in
const IndustrialSceneSVG = () => (
  <svg viewBox="0 0 1000 500" className="w-full h-full" style={{ filter: 'drop-shadow(0 30px 80px rgba(0,0,0,0.15))' }}>
    <defs>
      <linearGradient id="industry-sky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f8fafc" />
        <stop offset="100%" stopColor="#e2e8f0" />
      </linearGradient>
      <linearGradient id="industry-building" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="100%" stopColor="#334155" />
      </linearGradient>
      <linearGradient id="industry-smoke" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0" />
      </linearGradient>
      <filter id="industry-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.1"/>
      </filter>
    </defs>
    
    {/* Sky */}
    <rect width="1000" height="500" fill="url(#industry-sky)" />
    
    {/* Ground plane */}
    <rect x="0" y="380" width="1000" height="120" fill="#cbd5e1" />
    <rect x="0" y="380" width="1000" height="3" fill="#94a3b8" />
    
    {/* Building 1 - Main factory */}
    <g filter="url(#industry-shadow)">
      <rect x="80" y="140" width="250" height="240" fill="url(#industry-building)" rx="2" />
      {/* Windows */}
      {[0, 1, 2].map((row) => 
        [0, 1, 2, 3].map((col) => (
          <rect key={`w1-${row}-${col}`} x={100 + col * 55} y={160 + row * 60} width="35" height="40" fill="#64748b" opacity="0.4" rx="1" />
        ))
      )}
      {/* Roof structure */}
      <polygon points="80,140 205,80 330,140" fill="#334155" />
      {/* Chimney */}
      <rect x="170" y="40" width="35" height="100" fill="#475569" />
      <ellipse cx="187" cy="40" rx="17" ry="6" fill="#64748b" />
      {/* Smoke */}
      <ellipse cx="187" cy="15" rx="25" ry="18" fill="url(#industry-smoke)">
        <animate attributeName="cy" values="15;5;15" dur="4s" repeatCount="indefinite" />
        <animate attributeName="rx" values="25;35;25" dur="4s" repeatCount="indefinite" />
      </ellipse>
    </g>
    
    {/* Building 2 - Warehouse */}
    <g filter="url(#industry-shadow)">
      <rect x="380" y="200" width="200" height="180" fill="url(#industry-building)" rx="2" />
      {/* Curved roof */}
      <path d="M380 200 Q480 140 580 200" fill="#3f3f46" />
      {/* Large doors */}
      <rect x="400" y="280" width="70" height="100" fill="#1f2937" rx="2" />
      <rect x="490" y="280" width="70" height="100" fill="#1f2937" rx="2" />
      {/* Solar panels */}
      <rect x="400" y="165" width="40" height="25" fill="#1e40af" opacity="0.7" rx="1" />
      <rect x="450" y="155" width="40" height="25" fill="#1e40af" opacity="0.7" rx="1" />
      <rect x="500" y="160" width="40" height="25" fill="#1e40af" opacity="0.7" rx="1" />
    </g>
    
    {/* Building 3 - Processing unit */}
    <g filter="url(#industry-shadow)">
      <rect x="650" y="180" width="180" height="200" fill="url(#industry-building)" rx="2" />
      {/* Windows */}
      {[0, 1].map((row) =>
        [0, 1, 2].map((col) => (
          <rect key={`w3-${row}-${col}`} x={665 + col * 50} y={200 + row * 55} width="35" height="35" fill="#64748b" opacity="0.4" rx="1" />
        ))
      )}
      {/* Tanks */}
      <ellipse cx="710" cy="320" rx="25" ry="35" fill="#64748b" />
      <ellipse cx="780" cy="330" rx="20" ry="30" fill="#64748b" />
      {/* Chimney 2 */}
      <rect x="800" y="100" width="25" height="80" fill="#475569" />
      <ellipse cx="812" cy="85" rx="18" ry="12" fill="url(#industry-smoke)">
        <animate attributeName="cy" values="85;70;85" dur="5s" repeatCount="indefinite" />
      </ellipse>
    </g>
    
    {/* Carbonseed sensors (green dots with pulse) */}
    {[
      { cx: 300, cy: 200 },
      { cx: 520, cy: 250 },
      { cx: 750, cy: 230 },
      { cx: 180, cy: 180 },
      { cx: 680, cy: 350 },
    ].map((pos, i) => (
      <g key={i}>
        <circle cx={pos.cx} cy={pos.cy} r="8" fill="#059669">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
        </circle>
        <circle cx={pos.cx} cy={pos.cy} r="16" fill="none" stroke="#059669" strokeWidth="2" opacity="0.3">
          <animate attributeName="r" values="8;20;8" dur="2s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
        </circle>
      </g>
    ))}
    
    {/* Data flow lines (connecting sensors) */}
    <path 
      d="M300 200 Q400 150 520 250 Q620 200 750 230" 
      fill="none" 
      stroke="#059669" 
      strokeWidth="2" 
      strokeDasharray="8 4"
      opacity="0.3"
    >
      <animate attributeName="stroke-dashoffset" values="0;-24" dur="2s" repeatCount="indefinite" />
    </path>
    
    {/* Forklift */}
    <g>
      <rect x="600" y="360" width="50" height="25" fill="#eab308" rx="2" />
      <rect x="580" y="365" width="25" height="15" fill="#ca8a04" rx="1" />
      <rect x="650" y="355" width="4" height="30" fill="#78716c" />
      <rect x="640" y="345" width="20" height="8" fill="#78716c" />
      <circle cx="600" cy="390" r="10" fill="#3f3f46" />
      <circle cx="635" cy="390" r="10" fill="#3f3f46" />
    </g>
    
    {/* Truck */}
    <g>
      <rect x="40" y="355" width="80" height="35" fill="#4b5563" rx="2" />
      <rect x="10" y="365" width="35" height="25" fill="#374151" rx="2" />
      <rect x="15" y="370" width="25" height="12" fill="#60a5fa" opacity="0.4" rx="1" />
      <circle cx="30" cy="395" r="12" fill="#1f2937" />
      <circle cx="100" cy="395" r="12" fill="#1f2937" />
    </g>
  </svg>
);

export const TechnologySection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const complianceRef = useRef(null);
  const isComplianceInView = useInView(complianceRef, { once: true, margin: "-100px" });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"] // Start animating when section enters viewport from bottom
  });
  
  // Zoom effect - starts immediately as section enters view
  const imageScale = useTransform(scrollYProgress, [0, 0.2, 0.5], [0.4, 0.75, 1]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.1, 0.85, 1], [0.3, 1, 1, 0.8]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);
  const cardsOpacity = useTransform(scrollYProgress, [0.4, 0.55], [0, 1]);
  const cardsY = useTransform(scrollYProgress, [0.4, 0.55], [30, 0]);

  return (
    <section ref={containerRef} id="industries" className="relative">
      {/* Industry Scene with Zoom Effect */}
      <div className="h-[200vh] md:h-[250vh] relative">
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-surface to-surface-muted">
          {/* Section label */}
          <motion.div 
            style={{ opacity: titleOpacity }}
            className="absolute top-6 md:top-10 left-1/2 -translate-x-1/2 text-center z-30 px-4"
          >
            <span className="label-sm text-accent-green mb-1 md:mb-2 block text-xs md:text-sm">Industries We Serve</span>
            <h2 className="text-xl md:text-3xl lg:text-4xl font-semibold text-ink">Built for Indian manufacturing.</h2>
          </motion.div>
          
          {/* Industrial scene - zooms in immediately */}
          <motion.div 
            style={{ scale: imageScale, opacity: imageOpacity }}
            className="absolute inset-0 flex items-center justify-center z-10 px-4 md:px-8 will-change-transform"
          >
            <div className="w-full max-w-4xl md:max-w-5xl">
              <IndustrialSceneSVG />
            </div>
          </motion.div>
          
          {/* Industry cards - overlay with even spacing */}
          <motion.div 
            style={{ opacity: cardsOpacity, y: cardsY }}
            className="absolute bottom-6 md:bottom-12 left-0 right-0 z-20 px-3 md:px-6"
          >
            <div className="max-w-4xl md:max-w-5xl mx-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
                {industries.map((industry, index) => (
                  <motion.div
                    key={industry.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="group"
                  >
                    {/* Even sized cards - fixed height */}
                    <div className="h-[72px] md:h-[80px] p-2 md:p-3 bg-surface-elevated/90 backdrop-blur-sm rounded-lg border border-border/70 hover:border-accent-green/40 hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center">
                      <span className="text-lg md:text-xl mb-1 md:mb-2 block">{industry.icon}</span>
                      <h3 className="text-[10px] md:text-xs font-medium text-ink group-hover:text-accent-green transition-colors leading-tight text-center">{industry.name}</h3>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Compliance Section - Follows naturally */}
      <div className="section-spacing bg-surface-muted relative z-30">
        <div className="container-wide">
          <motion.div
            ref={complianceRef}
            initial={{ opacity: 0, y: 30 }}
            animate={isComplianceInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="label-sm text-accent-amber mb-4 block">Compliance</span>
            <h2 className="heading-lg text-ink max-w-2xl mb-12">
              Regulatory readiness, automated.
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {complianceItems.map((item, index) => (
                <motion.div
                  key={item.code}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isComplianceInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative p-6 bg-surface-elevated rounded-xl border border-border hover:border-accent-amber/30 transition-all duration-300"
                >
                  {/* Accent line */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent-amber via-accent-amber/50 to-transparent rounded-l-xl" />
                  
                  <span className="font-mono text-sm text-accent-amber">{item.code}</span>
                  <h3 className="font-medium text-ink mt-2 mb-2 group-hover:text-accent-amber transition-colors">{item.name}</h3>
                  <p className="text-sm text-ink-muted">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};