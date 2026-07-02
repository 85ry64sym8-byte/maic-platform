'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Sparkles, Copy, RefreshCw, ThumbsUp, ThumbsDown, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatWelcome } from '@/components/chat/chat-welcome';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: { title: string; score: number }[];
  thinking?: boolean;
}

const SAMPLE_RESPONSES: Record<string, string> = {
  default: `我来帮你拆解这个问题。

首先，从结构上，我们把它分为三个层面：

1. **业务场景** — 明确你要解决的真实问题
2. **学习路径** — 从入门到精通的关键节点
3. **评估体系** — 衡量学习效果的数据指标

接下来我会按这个框架继续展开。`,
};

function ThinkingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full bg-foreground/40"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </span>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [thinking, setThinking] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const handleSend = (text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setThinking(true);

    // 模拟 AI 思考
    setTimeout(() => {
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: SAMPLE_RESPONSES.default,
        sources: [
          { title: '人机协同 AI 训战营课程大纲', score: 0.92 },
          { title: 'WorkBuddy 企业级 AI 部署最佳实践', score: 0.85 },
          { title: '学习路径设计方法论 v2', score: 0.78 },
        ],
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setThinking(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-white">
      {/* Header */}
      <header className="h-14 px-6 flex items-center justify-between border-b border-black/[0.06] shrink-0">
        <div className="flex items-center gap-2">
          <h1 className="text-[14px] font-semibold">新对话</h1>
          <span className="text-[11px] text-foreground/40 px-1.5 py-0.5 rounded bg-black/[0.04]">
            GPT-4o · 知识库已连接
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button className="size-8 rounded-md hover:bg-black/[0.04] flex items-center justify-center text-foreground/50 hover:text-foreground/80 transition-colors">
            <RefreshCw className="size-3.5" />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto" onScroll={(e) => {
        const el = e.currentTarget;
        setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 200);
      }}>
        {messages.length === 0 ? (
          <ChatWelcome onSend={handleSend} />
        ) : (
          <div className="max-w-[760px] mx-auto px-6 py-8 space-y-6">
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn('flex gap-3', m.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                {m.role === 'assistant' && (
                  <div className="size-8 rounded-md bg-gradient-to-br from-[#0066FF] to-[#0044CC] flex items-center justify-center shrink-0">
                    <Sparkles className="size-4 text-white" />
                  </div>
                )}
                <div
                  className={cn(
                    'flex-1 min-w-0 max-w-[85%]',
                    m.role === 'user' && 'flex flex-col items-end',
                  )}
                >
                  <div
                    className={cn(
                      'px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed',
                      m.role === 'user'
                        ? 'bg-[#0066FF] text-white rounded-tr-md'
                        : 'bg-black/[0.03] text-foreground rounded-tl-md',
                    )}
                  >
                    {m.content}
                  </div>
                  {m.sources && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.sources.map((s, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 h-6 px-2 rounded-full bg-black/[0.04] text-[10px] text-foreground/60"
                        >
                          <span className="size-1 rounded-full bg-[#0066FF]" />
                          {s.title}
                        </span>
                      ))}
                    </div>
                  )}
                  {m.role === 'assistant' && (
                    <div className="mt-1.5 flex items-center gap-0.5">
                      <button className="size-7 rounded-md hover:bg-black/[0.04] flex items-center justify-center text-foreground/40 hover:text-foreground/70">
                        <Copy className="size-3" />
                      </button>
                      <button className="size-7 rounded-md hover:bg-black/[0.04] flex items-center justify-center text-foreground/40 hover:text-foreground/70">
                        <ThumbsUp className="size-3" />
                      </button>
                      <button className="size-7 rounded-md hover:bg-black/[0.04] flex items-center justify-center text-foreground/40 hover:text-foreground/70">
                        <ThumbsDown className="size-3" />
                      </button>
                      <button className="size-7 rounded-md hover:bg-black/[0.04] flex items-center justify-center text-foreground/40 hover:text-foreground/70">
                        <RefreshCw className="size-3" />
                      </button>
                    </div>
                  )}
                </div>
                {m.role === 'user' && (
                  <div className="size-8 rounded-full bg-gradient-to-br from-[#0066FF] to-[#7C3AED] flex items-center justify-center shrink-0">
                    <User className="size-4 text-white" />
                  </div>
                )}
              </motion.div>
            ))}

            {/* Thinking */}
            <AnimatePresence>
              {thinking && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex gap-3"
                >
                  <div className="size-8 rounded-md bg-gradient-to-br from-[#0066FF] to-[#0044CC] flex items-center justify-center shrink-0">
                    <Sparkles className="size-4 text-white" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-black/[0.03]">
                    <ThinkingDots />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* 浮动滚到底部按钮 */}
      <AnimatePresence>
        {showScrollBtn && messages.length > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 size-9 rounded-full bg-white border border-black/[0.08] shadow-md flex items-center justify-center hover:bg-black/[0.02] transition-colors"
            aria-label="滚到底部"
          >
            <ArrowDown className="size-3.5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
