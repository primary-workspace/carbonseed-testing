'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export const Footer = () => {
  return (
    <footer className="relative py-12 md:py-20 bg-ink text-white overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="footer-dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#ffffff" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-dots)" />
        </svg>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Brand - Mobile */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-8"
          >
            <Link href="/" className="inline-block mb-4">
              <span className="text-xl font-semibold text-white">carbonseed</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Industrial intelligence for Indian MSMEs.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-white/50">
              <span className="w-1.5 h-1.5 bg-accent-green rounded-full animate-pulse" />
              <span className="font-mono">Systems operational</span>
            </div>
          </motion.div>
          
          {/* Links - Mobile (horizontal) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap justify-center gap-4 mb-8 text-sm"
          >
            <Link href="#features" className="text-white/70 hover:text-white transition-colors">Features</Link>
            <span className="text-white/30">•</span>
            <Link href="#industries" className="text-white/70 hover:text-white transition-colors">Industries</Link>
            <span className="text-white/30">•</span>
            <Link href="#pricing" className="text-white/70 hover:text-white transition-colors">Pricing</Link>
            <span className="text-white/30">•</span>
            <Link href="/login" className="text-white/70 hover:text-white transition-colors">Dashboard</Link>
          </motion.div>
          
          {/* Contact - Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-8"
          >
            <a href="mailto:contact@carbonseed.io" className="text-accent-green text-sm hover:underline">
              contact@carbonseed.io
            </a>
          </motion.div>
          
          {/* Bottom - Mobile */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-6 border-t border-white/10 text-center space-y-2"
          >
            <p className="text-xs text-white/40">
              © {new Date().getFullYear()} Carbonseed Technologies Pvt. Ltd.
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-white/40">
              <span className="font-mono">v1.0.0</span>
              <span>Made with 🌱 in India</span>
            </div>
          </motion.div>
        </div>
        
        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-2"
            >
              <Link href="/" className="inline-block mb-6">
                <span className="text-2xl font-semibold text-white">carbonseed</span>
              </Link>
              <p className="text-white/60 leading-relaxed max-w-md mb-6">
                Industrial intelligence for Indian MSMEs. Low-cost edge sensing, cloud analytics, and compliance automation.
              </p>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <span className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
                <span className="font-mono">Systems operational</span>
              </div>
            </motion.div>

            {/* Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <h4 className="text-sm font-medium text-white/80 mb-5 uppercase tracking-wider">Product</h4>
              <ul className="space-y-4">
                <li>
                  <Link href="#features" className="text-white/60 hover:text-white transition-colors inline-flex items-center group">
                    <span className="w-0 group-hover:w-4 h-px bg-accent-green mr-0 group-hover:mr-2 transition-all duration-300" />
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#industries" className="text-white/60 hover:text-white transition-colors inline-flex items-center group">
                    <span className="w-0 group-hover:w-4 h-px bg-accent-green mr-0 group-hover:mr-2 transition-all duration-300" />
                    Industries
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-white/60 hover:text-white transition-colors inline-flex items-center group">
                    <span className="w-0 group-hover:w-4 h-px bg-accent-green mr-0 group-hover:mr-2 transition-all duration-300" />
                    Pricing
                  </Link>
                </li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <h4 className="text-sm font-medium text-white/80 mb-5 uppercase tracking-wider">Connect</h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/login" className="text-white/60 hover:text-white transition-colors inline-flex items-center group">
                    <span className="w-0 group-hover:w-4 h-px bg-accent-green mr-0 group-hover:mr-2 transition-all duration-300" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <a href="mailto:contact@carbonseed.io" className="text-white/60 hover:text-white transition-colors inline-flex items-center group">
                    <span className="w-0 group-hover:w-4 h-px bg-accent-green mr-0 group-hover:mr-2 transition-all duration-300" />
                    contact@carbonseed.io
                  </a>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Bottom */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4"
          >
            <p className="text-sm text-white/40">
              © {new Date().getFullYear()} Carbonseed Technologies Pvt. Ltd.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-sm text-white/40 font-mono">v1.0.0</span>
              <span className="text-sm text-white/40">Made with 🌱 in India</span>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};