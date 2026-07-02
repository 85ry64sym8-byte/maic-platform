'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

/**
 * Dashboard
 *
 * Design: dark-first, asymmetric bento grid (taste-skill/soft Z-Axis + minimalist bento),
 * stagger entry fade-up (minimalist §7), magnetic button hover (soft §5B),
 * hairline borders (minimalist §2).
 */
export default function DashboardPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/login')
        return
      }
      setEmail(user.email || '')
      setLoading(false)
    })
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a0a0b]">
        <div className="flex items-center gap-2 text-[13px] text-zinc-500">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
          加载中…
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0a0b] text-[#fafafa] antialiased">
      {/* Ambient orbs */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(700px circle at 85% 0%, rgba(99,102,241,0.12), transparent 60%), radial-gradient(500px circle at 0% 100%, rgba(56,189,248,0.08), transparent 60%)',
        }}
      />

      {/* Top bar */}
      <header className="relative z-10 border-b border-white/[0.06]">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-[0_2px_8px_rgba(99,102,241,0.35)]">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M7 1L12 3.5V8L7 10.5L2 8V3.5L7 1Z"
                  stroke="white"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
                <circle cx="7" cy="6" r="1.5" fill="white" />
              </svg>
            </div>
            <div>
              <div className="text-[13px] font-semibold tracking-tight">
                人机协同 AI 训战平台
              </div>
              <div className="text-[10px] text-zinc-500">
                Human · AI · Co-Learning
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-[11px] text-zinc-400 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {email}
            </div>
            <button
              onClick={handleSignOut}
              className="rounded-[8px] border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-[12px] text-zinc-400 transition-[transform,background-color,color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white/[0.05] hover:text-zinc-200 active:scale-[0.97]"
            >
              退出
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-[1280px] px-6 pb-12 pt-16">
        <div
          className="max-w-3xl"
          style={{
            animation:
              'fadeUp 800ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          }}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
            Welcome back
          </div>
          <h1 className="text-[44px] font-semibold leading-[1.05] tracking-[-0.03em] text-[#fafafa]">
            把你的经验资产 <br />
            <span className="bg-gradient-to-br from-indigo-300 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              转化为团队能力
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-[1.6] text-zinc-400">
            基于 37 篇企业知识库文档，提供 AI 对答、课程学习、实战训练三种学习路径。
            从这里开始你的训战。
          </p>
        </div>
      </section>

      {/* Bento grid (minimalist §5 + soft §3A2) */}
      <section className="relative z-10 mx-auto max-w-[1280px] px-6 pb-24">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-[260px_260px]">
          {/* AI 对话学习 — 主卡片（大）*/}
          <BentoCard
            href="/chat"
            delay={80}
            className="md:col-span-2 md:row-span-2"
            variant="primary"
            eyebrow="01"
            title="AI 对话学习"
            description="向 AI 助教提问，自动从知识库 37 篇文档中检索最相关的内容，给你即时、可追溯的回答。"
            cta="开始对话"
            badge="可用"
          />

          {/* 课程中心 — 小卡片 */}
          <BentoCard
            href="#"
            delay={160}
            className="md:col-span-1"
            variant="muted"
            eyebrow="02"
            title="课程中心"
            description="6 门体系化课程，覆盖训战营、管理者工作坊、高管工作坊等。"
            cta="即将上线"
            badge="即将上线"
          />

          {/* 实战训练营 — 小卡片 */}
          <BentoCard
            href="#"
            delay={240}
            className="md:col-span-1"
            variant="muted"
            eyebrow="03"
            title="实战训练营"
            description="PBL 项目制学习 + AI 陪练，在真实业务场景中打磨能力。"
            cta="即将上线"
            badge="即将上线"
          />
        </div>
      </section>

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

function BentoCard({
  href,
  delay,
  className = '',
  variant = 'default',
  eyebrow,
  title,
  description,
  cta,
  badge,
}: {
  href: string
  delay: number
  className?: string
  variant?: 'primary' | 'muted' | 'default'
  eyebrow: string
  title: string
  description: string
  cta: string
  badge: string
}) {
  const router = useRouter()
  const isPrimary = variant === 'primary'
  const isMuted = variant === 'muted'

  const onClick = () => {
    if (href && href !== '#') router.push(href)
  }

  return (
    <div
      className={`group relative ${className}`}
      style={{
        animation: 'fadeUp 800ms cubic-bezier(0.16, 1, 0.3, 1) both',
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Double-Bezel outer shell */}
      <div className="h-full rounded-[24px] border border-white/[0.08] bg-white/[0.015] p-[6px] transition-[transform,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-white/[0.03]">
        {/* Inner core */}
        <button
          onClick={onClick}
          disabled={isMuted}
          className={`relative flex h-full w-full flex-col justify-between rounded-[20px] border p-7 text-left transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isPrimary
              ? 'border-indigo-500/30 bg-gradient-to-br from-indigo-500/[0.08] to-transparent shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-indigo-500/50 hover:shadow-[0_8px_32px_rgba(99,102,241,0.2)]'
              : 'border-white/[0.06] bg-[#0d0d10] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] cursor-not-allowed opacity-60'
          } active:scale-[0.985]`}
        >
          {/* Top row */}
          <div className="flex items-start justify-between">
            <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">
              {eyebrow}
            </div>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium tracking-wide ${
                isPrimary
                  ? 'border border-indigo-500/30 bg-indigo-500/10 text-indigo-300'
                  : 'border border-white/10 bg-white/[0.04] text-zinc-500'
              }`}
            >
              {badge}
            </span>
          </div>

          {/* Middle */}
          <div className="mt-6">
            <h3 className="text-[22px] font-semibold tracking-[-0.015em] text-[#fafafa]">
              {title}
            </h3>
            <p className="mt-2 text-[13px] leading-[1.6] text-zinc-400">
              {description}
            </p>
          </div>

          {/* Bottom CTA */}
          <div className="mt-6 flex items-center gap-2 text-[13px]">
            <span
              className={`font-medium ${
                isPrimary
                  ? 'text-indigo-300 group-hover:text-indigo-200'
                  : 'text-zinc-500'
              }`}
            >
              {cta}
            </span>
            {isPrimary && (
              <span
                aria-hidden
                className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
              >
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path
                    d="M2 5.5h7M6 2l3 3.5L6 9"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            )}
          </div>

          {/* Subtle inner light highlight */}
          {isPrimary && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[20px]"
              style={{
                background:
                  'radial-gradient(400px circle at 100% 0%, rgba(99,102,241,0.12), transparent 50%)',
              }}
            />
          )}
        </button>
      </div>
    </div>
  )
}
