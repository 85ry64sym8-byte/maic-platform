'use client';

import { motion } from 'motion/react';
import { BookOpen, Plus, Sparkles, Users, Clock, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Course {
  id: string;
  title: string;
  description: string;
  source: 'official' | 'mine' | 'shared';
  agents: number;
  slides: number;
  duration: string;
  learners: number;
  thumbnail: string;
}

const SAMPLE: Course[] = [
  { id: '1', title: 'AI 时代的领导力：如何带好一支 AI 团队', description: '7 个模块，覆盖组织变革、目标设定、AI 教练技巧', source: 'official', agents: 5, slides: 24, duration: '4.5 小时', learners: 1283, thumbnail: 'leadership' },
  { id: '2', title: '人机协同工作流设计实战', description: '基于 OpenMAIC 多 Agent 课堂，11 个真实业务场景演练', source: 'official', agents: 8, slides: 36, duration: '6 小时', learners: 892, thumbnail: 'workflow' },
  { id: '3', title: '我做的：产品经理的 AI 协作手册', description: '用户自制的内部培训，3 章节', source: 'mine', agents: 3, slides: 12, duration: '1.5 小时', learners: 23, thumbnail: 'pm' },
  { id: '4', title: '从共享空间订阅：销售转化率诊断与优化', description: '来自共享空间的爆款课程', source: 'shared', agents: 4, slides: 18, duration: '2.5 小时', learners: 567, thumbnail: 'sales' },
];

const SOURCE_META: Record<Course['source'], { label: string; color: string }> = {
  official: { label: '官方', color: 'text-blue-600 bg-blue-50' },
  mine: { label: '我的', color: 'text-purple-600 bg-purple-50' },
  shared: { label: '共享', color: 'text-amber-600 bg-amber-50' },
};

const THUMB_GRADIENT: Record<string, string> = {
  leadership: 'from-indigo-500 to-violet-500',
  workflow: 'from-blue-500 to-cyan-500',
  pm: 'from-purple-500 to-pink-500',
  sales: 'from-amber-500 to-orange-500',
};

export default function CoursesPage() {
  return (
    <div className="px-8 py-8 max-w-[1200px] mx-auto">
      <header className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight">课程库</h1>
          <p className="mt-1 text-[13px] text-foreground/55">
            OpenMAIC 多 Agent 课堂 · 官方预置 + 自制课程
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-foreground text-background text-[13px] font-medium hover:opacity-90 active:scale-[0.98] transition-all">
          <Plus className="size-3.5" />
          <span>创建课程</span>
        </button>
      </header>

      {/* 搜索 + 过滤 */}
      <div className="flex items-center gap-2 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-foreground/40" />
          <input
            type="text"
            placeholder="搜索课程..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-black/[0.08] bg-white text-[13px] focus:outline-none focus:border-[#0066FF]/40 focus:ring-2 focus:ring-[#0066FF]/10 transition-all"
          />
        </div>
        {(['all', 'official', 'mine', 'shared'] as const).map((f, i) => (
          <button
            key={f}
            className={cn(
              'h-9 px-3 rounded-lg text-[12px] font-medium transition-colors',
              i === 0 ? 'bg-foreground text-background' : 'bg-black/[0.03] text-foreground/65 hover:bg-black/[0.06]',
            )}
          >
            {f === 'all' ? '全部' : SOURCE_META[f].label}
          </button>
        ))}
      </div>

      {/* 课程网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {SAMPLE.map((c, i) => {
          const meta = SOURCE_META[c.source];
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              whileHover={{ y: -3 }}
              className="group rounded-2xl border border-black/[0.06] bg-white overflow-hidden hover:shadow-lg hover:border-black/10 transition-all cursor-pointer"
            >
              {/* 缩略图 */}
              <div className={cn('relative aspect-[16/9] bg-gradient-to-br', THUMB_GRADIENT[c.thumbnail] || 'from-gray-400 to-gray-600')}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen className="size-10 text-white/40" />
                </div>
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className={cn('text-[10px] font-medium px-1.5 h-5 inline-flex items-center rounded', meta.color)}>
                    {meta.label}
                  </span>
                  <span className="text-[10px] font-medium px-1.5 h-5 inline-flex items-center rounded bg-white/20 text-white backdrop-blur-sm">
                    {c.agents} Agents
                  </span>
                </div>
              </div>
              {/* 信息 */}
              <div className="p-4">
                <h3 className="text-[15px] font-semibold leading-snug line-clamp-2 mb-1.5">{c.title}</h3>
                <p className="text-[12px] text-foreground/55 line-clamp-2 mb-3">{c.description}</p>
                <div className="flex items-center gap-3 text-[11px] text-foreground/50">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3" />
                    {c.duration}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="size-3" />
                    {c.learners.toLocaleString()}
                  </span>
                  <span>{c.slides} 帧</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
