'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Database, FileText, Sparkles, BookOpen, Globe, Brain, Cpu, Plus, Search, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KnowledgeItem {
  id: string;
  title: string;
  source: 'upload' | 'chat' | 'public';
  type: 'pdf' | 'doc' | 'web' | 'chat';
  size: string;
  updatedAt: string;
  chunks: number;
}

const SAMPLE: KnowledgeItem[] = [
  { id: '1', title: '2026 Q1 OKR 复盘文档.pdf', source: 'upload', type: 'pdf', size: '2.3 MB', updatedAt: '2 小时前', chunks: 142 },
  { id: '2', title: '人机协同 AI 训战营大纲', source: 'upload', type: 'doc', size: '850 KB', updatedAt: '昨天', chunks: 67 },
  { id: '3', title: '与 AI 助教的对话：关于 LLM 评测方法', source: 'chat', type: 'chat', size: '12 轮', updatedAt: '3 天前', chunks: 28 },
  { id: '4', title: 'WorkBuddy 企业版白皮书', source: 'public', type: 'web', size: '公开', updatedAt: '已订阅', chunks: 95 },
];

const SOURCE_META: Record<KnowledgeItem['source'], { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  upload: { label: '已上传', color: 'text-blue-600 bg-blue-50', icon: Upload },
  chat: { label: '聊天记录', color: 'text-purple-600 bg-purple-50', icon: Sparkles },
  public: { label: '已订阅', color: 'text-emerald-600 bg-emerald-50', icon: Globe },
};

export default function KnowledgePage() {
  return (
    <div className="px-8 py-8 max-w-[1100px] mx-auto">
      <header className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight">知识库</h1>
          <p className="mt-1 text-[13px] text-foreground/55">
            上传文档、收藏聊天记录、订阅公开知识库 — 全部接入 AI 助理
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-foreground text-background text-[13px] font-medium hover:opacity-90 active:scale-[0.98] transition-all">
          <Plus className="size-3.5" />
          <span>上传文档</span>
        </button>
      </header>

      {/* 搜索 + 过滤 */}
      <div className="flex items-center gap-2 mb-5">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-foreground/40" />
          <input
            type="text"
            placeholder="搜索知识库..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-black/[0.08] bg-white text-[13px] focus:outline-none focus:border-[#0066FF]/40 focus:ring-2 focus:ring-[#0066FF]/10 transition-all"
          />
        </div>
        {(['all', 'upload', 'chat', 'public'] as const).map((f, i) => (
          <button
            key={f}
            className={cn(
              'h-9 px-3 rounded-lg text-[12px] font-medium transition-colors',
              i === 0
                ? 'bg-foreground text-background'
                : 'bg-black/[0.03] text-foreground/65 hover:bg-black/[0.06]',
            )}
          >
            {f === 'all' ? '全部' : SOURCE_META[f].label}
          </button>
        ))}
      </div>

      {/* 知识库卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SAMPLE.map((item, i) => {
          const meta = SOURCE_META[item.source];
          const Icon = meta.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              whileHover={{ y: -2 }}
              className="group p-4 rounded-xl border border-black/[0.06] bg-white hover:border-black/15 hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="size-9 rounded-lg bg-gradient-to-br from-foreground/[0.04] to-foreground/[0.08] flex items-center justify-center">
                  <FileText className="size-4 text-foreground/55" />
                </div>
                <span className={cn('text-[10px] font-medium px-1.5 h-5 inline-flex items-center rounded', meta.color)}>
                  <Icon className="size-2.5 mr-0.5" />
                  {meta.label}
                </span>
              </div>
              <h3 className="text-[14px] font-medium leading-snug line-clamp-2 mb-2">{item.title}</h3>
              <div className="flex items-center gap-3 text-[11px] text-foreground/50">
                <span>{item.size}</span>
                <span className="size-1 rounded-full bg-foreground/20" />
                <span>{item.chunks} 切片</span>
                <span className="size-1 rounded-full bg-foreground/20" />
                <span>{item.updatedAt}</span>
              </div>
            </motion.div>
          );
        })}

        {/* 上传卡片 */}
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: SAMPLE.length * 0.04, duration: 0.3 }}
          className="group p-4 rounded-xl border-2 border-dashed border-black/[0.08] hover:border-[#0066FF]/40 hover:bg-[#0066FF]/[0.02] transition-all min-h-[140px] flex flex-col items-center justify-center gap-2"
        >
          <div className="size-9 rounded-full bg-black/[0.04] group-hover:bg-[#0066FF]/10 flex items-center justify-center transition-colors">
            <Upload className="size-4 text-foreground/45 group-hover:text-[#0066FF] transition-colors" />
          </div>
          <p className="text-[12px] text-foreground/50 group-hover:text-foreground/70">拖拽或点击上传</p>
          <p className="text-[10px] text-foreground/30">支持 PDF / DOCX / MD / TXT / 网页 URL</p>
        </motion.button>
      </div>

      <p className="mt-8 text-[12px] text-foreground/40">
        提示：聊天时勾选「深度思考」技能，AI 会自动把高质量对话沉淀到知识库
      </p>
    </div>
  );
}
