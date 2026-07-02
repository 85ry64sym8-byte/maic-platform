'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

/**
 * Login / Register page
 *
 * Design system applied (per DESIGN.md + 3 UI skill references):
 *  - emil-design-eng:   scale(0.97) on :active, ease-out, never ease-in
 *  - taste-skill/soft:  Ethereal Glass vibe — radial glow orbs in the background,
 *                       Double-Bezel card (outer shell + inner core), button-in-button
 *                       trailing icon, cubic-bezier(0.32, 0.72, 0, 1)
 *  - taste-skill/min:   1px hairline borders, no drop shadows, scroll entry fade-up
 *  - ui-ux-pro-max/ui-styling: shadcn-style semantic tokens
 */

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'login' | 'register'>('login')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setError('注册成功！请使用左侧 Supabase 后台确认邮箱后登录。')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        router.push('/dashboard')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '登录失败'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0a0b] text-[#fafafa] antialiased">
      {/* Ambient gradient orbs (taste-skill/soft: Ethereal Glass vibe) */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(800px circle at 20% 25%, rgba(99,102,241,0.18), transparent 60%), radial-gradient(600px circle at 80% 70%, rgba(56,189,248,0.10), transparent 60%)',
        }}
      />
      {/* Film grain (taste-skill/soft: subtle noise overlay) */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div
          className="w-full max-w-[420px] animate-[fadeUp_700ms_cubic-bezier(0.16,1,0.3,1)_both]"
          style={
            {
              '--ease-out-soft': 'cubic-bezier(0.16, 1, 0.3, 1)',
            } as React.CSSProperties
          }
        >
          {/* Brand eyebrow */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
              Human · AI · Co-Learning
            </div>
            <h1 className="text-center text-[28px] font-semibold tracking-[-0.02em] text-[#fafafa]">
              人机协同 AI 训战平台
            </h1>
            <p className="text-center text-[13px] text-zinc-500">
              {mode === 'login' ? '登录到你的学习空间' : '创建你的学习空间'}
            </p>
          </div>

          {/* Double-Bezel card (taste-skill/soft: outer shell + inner core) */}
          <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.02] p-1.5">
            <div className="rounded-[20px] border border-white/[0.06] bg-[#0d0d10] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-zinc-400">
                    邮箱
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full rounded-[10px] border border-white/10 bg-[#0a0a0b] px-3.5 py-2.5 text-[14px] text-[#fafafa] placeholder-zinc-600 outline-none transition-[border-color,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-zinc-400">
                    密码
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="至少 6 位"
                    className="w-full rounded-[10px] border border-white/10 bg-[#0a0a0b] px-3.5 py-2.5 text-[14px] text-[#fafafa] placeholder-zinc-600 outline-none transition-[border-color,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]"
                    required
                    minLength={6}
                  />
                </div>

                {error && (
                  <div
                    className="rounded-[8px] border border-red-500/20 bg-red-500/[0.06] px-3 py-2 text-[12px] text-red-300"
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                {/* Primary CTA — Button-in-Button (taste-skill/soft) + emil scale(0.97) */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex w-full items-center justify-center gap-2 rounded-[10px] bg-indigo-600 px-4 py-2.5 text-[14px] font-medium text-white outline-none transition-[transform,background-color,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-indigo-500 hover:shadow-[0_4px_16px_rgba(99,102,241,0.35)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
                >
                  <span>{loading ? '处理中…' : mode === 'login' ? '登录' : '注册'}</span>
                  <span
                    aria-hidden
                    className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/15 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5"
                  >
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                      <path
                        d="M1 4.5h7M5 1.5l3 3-3 3"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
              </form>

              <div className="mt-6 flex items-center gap-3 text-[11px] text-zinc-600">
                <div className="h-px flex-1 bg-white/[0.06]" />
                <span>OR</span>
                <div className="h-px flex-1 bg-white/[0.06]" />
              </div>

              <p className="mt-5 text-center text-[13px] text-zinc-500">
                {mode === 'login' ? '还没有账号？' : '已有账号？'}
                <button
                  onClick={() => {
                    setError('')
                    setMode(mode === 'login' ? 'register' : 'login')
                  }}
                  className="ml-1.5 text-indigo-400 transition-colors duration-150 ease-out hover:text-indigo-300"
                >
                  {mode === 'login' ? '注册新账号' : '返回登录'}
                </button>
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-[11px] text-zinc-600">
            登录即代表同意服务条款 · Powered by DeepSeek × Supabase
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(16px);
            filter: blur(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }
      `}</style>
    </main>
  )
}
