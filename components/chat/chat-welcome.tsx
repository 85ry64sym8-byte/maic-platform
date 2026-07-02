'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp, ImagePlus, Globe, BookOpen, Sparkles, Wand2, Cpu, Brain, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Skill {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const SKILLS: Skill[] = [
  { id: 'study', label: 'AI 学习设计', description: '基于场景生成结构化学习路径', icon: BookOpen, color: 'text-orange-500' },
  { id: 'narrate', label: 'AI 业务洞察', description: '把业务数据转化为洞察叙事', icon: Sparkles, color: 'text-emerald-500' },
  { id: 'course', label: '课程生成器', description: '一键产出完整课程大纲 + 课件', icon: Wand2, color: 'text-blue-500' },
  { id: 'map', label: '学习地图生成器', description: '把知识点织成可视化的成长地图', icon: Brain, color: 'text-purple-500' },
  { id: 'depth', label: '深度思考', description: '多 Agent 协同推理，严谨求证', icon: Cpu, color: 'text-rose-500' },
  { id: 'search', label: '联网搜索', description: '实时检索最新资讯与学术论文', icon: Search, color: 'text-cyan-500' },
];

interface ChatWelcomeProps {
  onSend: (text: string) => void;
}

export function ChatWelcome({ onSend }: ChatWelcomeProps) {
  const [text, setText] = useState('');
  const [enabledSkills, setEnabledSkills] = useState<Set<string>>(new Set());

  const toggleSkill = (id: string) => {
    setEnabledSkills((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-4rem)] px-6 py-12">
      {/* Greeting */}
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-[40px] md:text-[52px] font-semibold tracking-tight text-foreground text-center leading-[1.1]"
      >
        今天想精进哪项技能？
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="mt-3 text-[14px] text-foreground/50"
      >
        基于 OpenClaw 多 Agent 体系 + LobeChat 专家协议
      </motion.p>

      {/* 输入框 */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[680px] mt-10"
      >
        <div
          className={cn(
            'group relative w-full rounded-2xl border bg-white transition-all',
            'border-black/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.04)]',
            'focus-within:border-[#0066FF]/40 focus-within:shadow-[0_8px_24px_-8px_rgba(0,102,255,0.18)]',
          )}
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="发消息或输入 / 选择技能"
            rows={2}
            className="w-full resize-none border-0 bg-transparent px-5 pt-4 pb-2 text-[14px] leading-relaxed text-foreground placeholder:text-foreground/35 focus:outline-none"
          />
          <div className="px-3 pb-3 flex items-center gap-1.5">
            <button
              className="size-8 rounded-lg flex items-center justify-center text-foreground/45 hover:text-foreground/80 hover:bg-black/[0.04] transition-colors"
              aria-label="上传图片"
            >
              <ImagePlus className="size-4" />
            </button>
            <button
              className="size-8 rounded-lg flex items-center justify-center text-foreground/45 hover:text-foreground/80 hover:bg-black/[0.04] transition-colors"
              aria-label="联网搜索"
            >
              <Globe className="size-4" />
            </button>
            <div className="flex-1" />
            <button
              onClick={handleSend}
              disabled={!text.trim()}
              className={cn(
                'size-9 rounded-lg flex items-center justify-center transition-all',
                text.trim()
                  ? 'bg-[#0066FF] text-white hover:bg-[#0052CC] active:scale-95 shadow-sm'
                  : 'bg-black/[0.04] text-foreground/30 cursor-not-allowed',
              )}
              aria-label="发送"
            >
              <ArrowUp className="size-4" />
            </button>
          </div>
        </div>

        {/* 技能 chips */}
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {SKILLS.map((skill) => {
            const Icon = skill.icon;
            const enabled = enabledSkills.has(skill.id);
            return (
              <motion.button
                key={skill.id}
                whileTap={{ scale: 0.96 }}
                onClick={() => toggleSkill(skill.id)}
                className={cn(
                  'group inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[12px] font-medium transition-all border',
                  enabled
                    ? 'bg-foreground text-background border-foreground shadow-sm'
                    : 'bg-white border-black/[0.08] text-foreground/75 hover:border-black/20 hover:text-foreground',
                )}
                title={skill.description}
              >
                <Icon
                  className={cn(
                    'size-3.5',
                    enabled ? 'text-background' : skill.color,
                  )}
                />
                <span>{skill.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* 已选技能描述 */}
        <AnimatePresence>
          {enabledSkills.size > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 p-3 rounded-xl bg-black/[0.02] border border-black/[0.05]">
                <p className="text-[11px] font-medium text-foreground/40 uppercase tracking-wider mb-1.5">
                  已激活技能
                </p>
                <ul className="space-y-0.5">
                  {SKILLS.filter((s) => enabledSkills.has(s.id)).map((s) => (
                    <li
                      key={s.id}
                      className="text-[12px] text-foreground/70 flex items-start gap-1.5"
                    >
                      <span className="text-[#0066FF]">•</span>
                      <span>
                        <span className="font-medium text-foreground/85">{s.label}</span> — {s.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <p className="mt-10 text-[11px] text-foreground/30">
        提示：按 ⌘/Ctrl + Enter 发送 · 选择技能后 AI 将按需调度对应 Agent
      </p>
    </div>
  );
}
