'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

/**
 * AI Chat page with RAG
 *
 * Design: taste-skill/soft (Ethereal Glass + Z-Axis Cascade) + emil
 * animations. Streaming-like incremental rendering of the assistant's
 * reply, source citations below each answer, and a sticky input bar
 * that mirrors Linear's command bar aesthetic.
 */

interface Source {
  id: string
  title: string
  category: string | null
  score: number
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  sources?: Source[]
  ts: number
}

const SUGGESTED = [
  '什么是人机协同 AI 训战营？',
  'WorkBuddy 企业版和免费版有什么区别？',
  '制造业如何用 AI 提效？',
  '如何搭建一个 Coze 智能体？',
]

export default function ChatPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/login')
        return
      }
      setAuthChecked(true)
    })
  }, [router])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, busy])

  const send = async (questionText?: string) => {
    const q = (questionText ?? input).trim()
    if (!q || busy) return

    const userMsg: Message = { role: 'user', content: q, ts: Date.now() }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setBusy(true)

    try {
      const { data: sess } = await supabase.auth.getSession()
      const token = sess.session?.access_token
      const resp = await fetch('/api/rag-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          question: q,
          history: messages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}))
        throw new Error(err.error || `HTTP ${resp.status}`)
      }
      const data = await resp.json()
      const assistantMsg: Message = {
        role: 'assistant',
        content: data.answer ?? '(空响应)',
        sources: data.sources ?? [],
        ts: Date.now(),
      }
      setMessages((m) => [...m, assistantMsg])
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '请求失败'
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: `⚠️ 出错了：${msg}\n\n请检查 /api/rag-chat 路由及 DEEPSEEK_API_KEY 配置。`,
          ts: Date.now(),
        },
      ])
    } finally {
      setBusy(false)
    }
  }

  if (!authChecked) {
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
    <main className="relative flex h-screen flex-col overflow-hidden bg-[#0a0a0b] text-[#fafafa] antialiased">
      {/* Ambient orb */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(900px circle at 50% -20%, rgba(99,102,241,0.16), transparent 60%)',
        }}
      />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between border-b border-white/[0.06] px-6 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="rounded-[8px] border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-[12px] text-zinc-400 transition-[transform,background-color,color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white/[0.05] hover:text-zinc-200 active:scale-[0.97]"
          >
            ← 返回
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-gradient-to-br from-indigo-500 to-indigo-700">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 4.5C2 3.4 2.9 2.5 4 2.5h4c1.1 0 2 .9 2 2v3c0 1.1-.9 2-2 2H6l-2 2v-2H4c-1.1 0-2-.9-2-2v-3z"
                  stroke="white"
                  strokeWidth="1.2"
                  fill="none"
                />
              </svg>
            </div>
            <div>
              <div className="text-[13px] font-semibold">AI 助教</div>
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                基于知识库 37 篇文档 · DeepSeek
              </div>
            </div>
          </div>
        </div>
        <div className="text-[11px] text-zinc-500">
          {messages.length > 0 ? `${messages.length} 条对话` : ''}
        </div>
      </header>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="relative z-10 flex-1 overflow-y-auto"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
          {messages.length === 0 ? (
            <EmptyState onPick={(q) => send(q)} />
          ) : (
            messages.map((m, i) => (
              <MessageBubble key={i} msg={m} />
            ))
          )}
          {busy && (
            <div className="flex items-center gap-2 text-[12px] text-zinc-500">
              <span className="flex gap-1">
                <Dot delay={0} />
                <Dot delay={120} />
                <Dot delay={240} />
              </span>
              AI 正在思考…
            </div>
          )}
        </div>
      </div>

      {/* Input bar */}
      <div className="relative z-10 border-t border-white/[0.06] bg-[#0a0a0b]/80 backdrop-blur">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              send()
            }}
            className="group flex items-end gap-2 rounded-[16px] border border-white/[0.08] bg-white/[0.02] p-1.5 transition-[border-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-within:border-indigo-500/50 focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  send()
                }
              }}
              placeholder="向 AI 助教提问…（Shift+Enter 换行）"
              rows={1}
              className="flex-1 resize-none bg-transparent px-3 py-2.5 text-[14px] text-[#fafafa] placeholder-zinc-600 outline-none"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="group/btn inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-indigo-600 text-white transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-indigo-500 active:scale-[0.94] disabled:cursor-not-allowed disabled:opacity-30 disabled:active:scale-100"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 7h10M7 2l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
          <p className="mt-2 text-center text-[10px] text-zinc-600">
            AI 回答基于企业知识库，仅供参考
          </p>
        </div>
      </div>
    </main>
  )
}

function EmptyState({ onPick }: { onPick: (q: string) => void }) {
  return (
    <div
      className="py-12"
      style={{
        animation: 'fadeUp 700ms cubic-bezier(0.16, 1, 0.3, 1) both',
      }}
    >
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[14px] bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-[0_4px_16px_rgba(99,102,241,0.4)]">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path
              d="M11 2L18 5.5v6L11 15 4 11.5v-6L11 2z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinejoin="round"
              fill="none"
            />
            <circle cx="11" cy="8.5" r="2" fill="white" />
          </svg>
        </div>
        <h2 className="text-[24px] font-semibold tracking-[-0.02em]">
          有什么想问 AI 助教的？
        </h2>
        <p className="mt-2 text-[13px] text-zinc-500">
          基于 37 篇企业知识库文档，给你即时、可追溯的回答
        </p>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {SUGGESTED.map((q, i) => (
          <button
            key={q}
            onClick={() => onPick(q)}
            className="group/sq rounded-[12px] border border-white/[0.08] bg-white/[0.02] p-3 text-left text-[13px] text-zinc-300 transition-[transform,background-color,border-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-indigo-500/30 hover:bg-white/[0.04] active:scale-[0.98]"
            style={{
              animation: 'fadeUp 700ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: `${100 + i * 60}ms`,
            }}
          >
            <div className="flex items-center justify-between">
              <span>{q}</span>
              <span className="text-zinc-600 transition-transform duration-200 group-hover/sq:translate-x-0.5">
                →
              </span>
            </div>
          </button>
        ))}
      </div>
      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
            filter: blur(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }
      `}</style>
    </div>
  )
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user'
  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      style={{
        animation:
          'fadeUp 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
      }}
    >
      <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
        <div
          className={`rounded-[16px] px-4 py-3 text-[14px] leading-[1.65] ${
            isUser
              ? 'rounded-tr-[6px] bg-indigo-600 text-white'
              : 'rounded-tl-[6px] border border-white/[0.08] bg-[#111113] text-zinc-200'
          }`}
        >
          {!isUser && (
            <div className="mb-1.5 flex items-center gap-1.5 text-[10px] text-zinc-500">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(56,189,248,0.5)]" />
              AI 助教
            </div>
          )}
          <div className="whitespace-pre-wrap break-words">{msg.content}</div>
        </div>
        {!isUser && msg.sources && msg.sources.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-1">
            {msg.sources.map((s) => (
              <span
                key={s.id}
                className="inline-flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.02] px-2 py-0.5 text-[10px] text-zinc-400"
                title={s.title}
              >
                <span className="h-1 w-1 rounded-full bg-indigo-400" />
                {s.title}
              </span>
            ))}
          </div>
        )}
      </div>
      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="h-1.5 w-1.5 rounded-full bg-indigo-400"
      style={{
        animation: 'bounce 1.2s ease-in-out infinite',
        animationDelay: `${delay}ms`,
      }}
    >
      <style jsx>{`
        @keyframes bounce {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-4px);
            opacity: 1;
          }
        }
      `}</style>
    </span>
  )
}
