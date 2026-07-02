'use client';

import { motion } from 'motion/react';
import { Globe, Database, BookOpen, Filter } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SharedItem {
  id: string;
  title: string;
  type: 'knowledge' | 'course';
  description: string;
  category: string;
  author: string;
  uses: number;
  gradient: string;
}

const KNOWLEDGE_ITEMS: SharedItem[] = [
  { id: 'k1', title: '制造业数字化转型方法论', type: 'knowledge', description: '12 篇精选文章 + 实战案例库', category: '行业研究', author: '@行业研究组', uses: 3421, gradient: 'from-blue-500 to-cyan-500' },
  { id: 'k2', title: 'AI 产品经理必读论文集', type: 'knowledge', description: '50 篇精选 HCI/AI 论文，按主题分类', category: '学术', author: '@产品研究院', uses: 2156, gradient: 'from-violet-500 to-purple-500' },
  { id: 'k3', title: 'OKR 实战手册 2026 版', type: 'knowledge', description: '字节、阿里、华为内部 OKR 模板', category: '管理', author: '@管理工具坊', uses: 5680, gradient: 'from-emerald-500 to-teal-500' },
  { id: 'k4', title: '全栈开发速查表', type: 'knowledge', description: 'React + Next.js + Supabase 最佳实践', category: '技术', author: '@开发者社区', uses: 8932, gradient: 'from-orange-500 to-rose-500' },
];

const COURSE_ITEMS: SharedItem[] = [
  { id: 'c1', title: '销售转化率诊断与优化', type: 'course', description: '5 模块 · 18 帧 · 8 专家协同', category: '销售', author: '@销售教练 Lisa', uses: 1240, gradient: 'from-pink-500 to-rose-500' },
  { id: 'c2', title: '新人 7 天入职地图', type: 'course', description: '6 模块 · 21 帧 · 含作业 + 测评', category: 'HR', author: '@HR 学院', uses: 3567, gradient: 'from-amber-500 to-orange-500' },
  { id: 'c3', title: '高管的 AI 思维课', type: 'course', description: '4 模块 · 16 帧 · 案例驱动', category: '领导力', author: '@领导力中心', uses: 892, gradient: 'from-indigo-500 to-blue-500' },
  { id: 'c4', title: '客户成功经理必修', type: 'course', description: '5 模块 · 22 帧 · 含 NPS 提升策略', category: '客户成功', author: '@CS 联盟', uses: 1456, gradient: 'from-fuchsia-500 to-pink-500' },
];

const FILTERS = [
  { id: 'all', label: '全部', icon: Globe },
  { id: 'knowledge', label: '知识库', icon: Database },
  { id: 'course', label: '课程', icon: BookOpen },
];

export default function SharedPage() {
  const [filter, setFilter] = useState<'all' | 'knowledge' | 'course'>('all');

  const items = filter === 'all' ? [...KNOWLEDGE_ITEMS, ...COURSE_ITEMS]
    : filter === 'knowledge' ? KNOWLEDGE_ITEMS
    : COURSE_ITEMS;

  return (
    <div className="px-8 py-8 max-w-[1200px] mx-auto">
      <header className="mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-[28px] font-semibold tracking-tight">共享空间</h1>
          <span className="text-[10px] font-semibold px-1.5 h-5 inline-flex items-center rounded-full bg-amber-100 text-amber-700">
            BETA
          </span>
        </div>
        <p className="mt-1 text-[13px] text-foreground/55">
          用户的知识库与课程经公开后进入此处 · 全平台用户可订阅学习
        </p>
      </header>

      {/* 分类切换 */}
      <div className="flex items-center gap-2 mb-6">
        {FILTERS.map((f) => {
          const Icon = f.icon;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as 'all' | 'knowledge' | 'course')}
              className={cn(
                'inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-[13px] font-medium transition-colors',
                filter === f.id ? 'bg-foreground text-background' : 'bg-black/[0.03] text-foreground/65 hover:bg-black/[0.06]',
              )}
            >
              <Icon className="size-3.5" />
              {f.label}
            </button>
          );
        })}
        <div className="flex-1" />
        <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[12px] text-foreground/55 hover:bg-black/[0.04] transition-colors">
          <Filter className="size-3.5" />
          筛选
        </button>
      </div>

      {/* 共享项网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, i) => {
          const isKnowledge = item.type === 'knowledge';
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              whileHover={{ y: -2 }}
              className="group p-4 rounded-2xl border border-black/[0.06] bg-white hover:border-black/15 hover:shadow-md transition-all cursor-pointer"
            >
              {/* 顶部渐变 + 类型 */}
              <div className={cn('relative aspect-[16/8] rounded-xl bg-gradient-to-br mb-3 overflow-hidden', item.gradient)}>
                <div className="absolute inset-0 flex items-center justify-center">
                  {isKnowledge ? (
                    <Database className="size-10 text-white/40" />
                  ) : (
                    <BookOpen className="size-10 text-white/40" />
                  )}
                </div>
                <div className="absolute top-2.5 left-2.5">
                  <span className="text-[10px] font-medium px-1.5 h-5 inline-flex items-center rounded bg-white/90 text-foreground/80 backdrop-blur-sm">
                    {isKnowledge ? '知识库' : '课程'}
                  </span>
                </div>
                <div className="absolute top-2.5 right-2.5">
                  <span className="text-[10px] font-medium px-1.5 h-5 inline-flex items-center rounded bg-white/20 text-white backdrop-blur-sm">
                    {item.category}
                  </span>
                </div>
              </div>
              <h3 className="text-[14px] font-semibold leading-snug line-clamp-2 mb-1">{item.title}</h3>
              <p className="text-[12px] text-foreground/55 line-clamp-1.5 mb-3">{item.description}</p>
              <div className="flex items-center justify-between text-[11px] text-foreground/50">
                <span>{item.author}</span>
                <span>{item.uses.toLocaleString()} 次使用</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="mt-8 text-[12px] text-foreground/40">
        💡 在知识库/课程库点击「公开」即可发布到共享空间
      </p>
    </div>
  );
}
