'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Invalid email or password');

      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex flex-1 bg-ink relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="login-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#login-grid)" />
          </svg>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="text-2xl font-semibold text-white">
            carbonseed
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-md"
          >
            <div className="w-16 h-16 rounded-2xl bg-accent-green/20 flex items-center justify-center mb-8">
              <svg className="w-8 h-8 text-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-semibold text-white mb-4 leading-tight">
              Industrial intelligence for the modern factory.
            </h2>
            <p className="text-lg text-white/60 leading-relaxed">
              Real-time monitoring, predictive maintenance, and automated compliance — all in one platform.
            </p>
          </motion.div>
          
          <div className="flex items-center gap-8 text-sm text-white/40">
            <span>© 2026 Carbonseed</span>
            <span>Made in India</span>
          </div>
        </div>
        
        {/* Decorative gradient */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-accent-green/20 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden inline-block mb-8">
            <span className="text-xl font-semibold text-ink">carbonseed</span>
          </Link>

          <h1 className="text-2xl font-semibold text-ink mb-2">Welcome back</h1>
          <p className="text-ink-muted mb-8">Sign in to access your dashboard</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink mb-2">Email</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-surface-muted border-0 rounded-xl text-ink placeholder-ink-faint focus:outline-none focus:ring-2 focus:ring-accent-green/30 transition-all"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ink mb-2">Password</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-surface-muted border-0 rounded-xl text-ink placeholder-ink-faint focus:outline-none focus:ring-2 focus:ring-accent-green/30 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-ink text-white font-medium rounded-xl hover:bg-ink/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-ink/10"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
                    <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign in'}
            </button>
          </form>

          <div className="mt-8 p-5 bg-surface-muted rounded-xl">
            <p className="text-xs font-medium text-ink-muted mb-3">Demo credentials</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-faint">Admin</span>
                <span className="font-mono text-ink text-xs">admin@carbonseed.io</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-faint">Owner</span>
                <span className="font-mono text-ink text-xs">owner@steelforge.in</span>
              </div>
              <p className="text-xs text-ink-faint pt-2 border-t border-border mt-2">Password: admin123 / password123</p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-ink-muted hover:text-accent-green transition-colors">
              ← Back to homepage
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
