'use client';

import { motion } from 'motion/react';
import { Sparkles, Code, PenTool, Calculator, BarChart3, Briefcase, Heart, Microscope, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Expert {
  id: string;
  name: string;
  role: string;
  description: string;
  category: 'tech' | 'business' | 'creative' | 'science' | 'life';
  uses: number;
  rating: number;
  gradient: string;
  icon: React.ComponentType<{ className?: string }>;
}

const EXPERTS: Expert[] = [
  { id: '1', name: '代码架构师', role: '系统设计 · 代码审查', description: '资深软件架构师，擅长分布式系统设计、代码评审、技术选型', category: 'tech', uses: 12340, rating: 4.9, gradient: 'from-blue-500 to-indigo-600', icon: Code },
  { id: '2', name: '商业策略顾问', role: '战略 · 商业模式', description: '前麦肯锡战略顾问，擅长商业模型分析、增长策略', category: 'business', uses: 8921, rating: 4.8, gradient: 'from-emerald-500 to-teal-600', icon: Briefcase },
  { id: '3', name: '文案大师', role: '品牌 · 营销 · 故事', description: '10 年品牌文案经验，擅长故事化叙事、品牌定位', category: 'creative', uses: 15620, rating: 4.9, gradient: 'from-pink-500 to-rose-600', icon: PenTool },
  { id: '4', name: '数据分析师', role: 'SQL · 可视化 · 洞察', description: '从数据中挖掘商业洞察，SQL/Excel/Python 全栈', category: 'business', uses: 7832, rating: 4.7, gradient: 'from-cyan-500 to-blue-600', icon: BarChart3 },
  { id: '5', name: '数学教练', role: '高等数学 · 线性代数', description: '从概念到例题，帮你建立数学直觉', category: 'science', uses: 5612, rating: 4.8, gradient: 'from-violet-500 to-purple-600', icon: Calculator },
  { id: '6', name: '科研助手', role: '文献综述 · 实验设计', description: '基于学术论文训练，帮你写综述、设计实验', category: 'science', uses: 4321, rating: 4.7, gradient: 'from-amber-500 to-orange-600', icon: Microscope },
  { id: '7', name: '心理咨询师', role: '情绪疏导 · 沟通技巧', description: '温暖专业的倾听，帮你梳理情绪、改善人际关系', category: 'life', uses: 9210, rating: 4.9, gradient: 'from-rose-500 to-pink-600', icon: Heart },
  { id: '8', name: 'DevOps 工程师', role: 'CI/CD · 容器化', description: '云原生实战，帮你搭建稳定可扩展的部署流水线', category: 'tech', uses: 6230, rating: 4.8, gradient: 'from-slate-600 to-slate-800', icon: Wrench },
  { id: '9', name: 'PPT 设计师', role: '演示 · 视觉 · 信息图', description: '把枯燥内容变成有说服力的演示', category: 'creative', uses: 8470, rating: 4.6, gradient: 'from-fuchsia-500 to-pink-600', icon: Sparkles },
];

const CATEGORIES = [
  { id: 'all', label: '全部' },
  { id: 'tech', label: '技术' },
  { id: 'business', label: '商业' },
  { id: 'creative', label: '创意' },
  { id: 'science', label: '学术' },
  { id: 'life', label: '生活' },
];

export default function ExpertsPage() {
  return (
    <div className="px-8 py-8 max-w-[1200px] mx-auto">
      <header className="mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-[28px] font-semibold tracking-tight">专家中心</h1>
          <span className="text-[10px] font-semibold px-1.5 h-5 inline-flex items-center rounded-full bg-[#0066FF]/[0.1] text-[#0066FF]">
            LOBECHAT PROTOCOL
          </span>
        </div>
        <p className="mt-1 text-[13px] text-foreground/55">
          平台预置的专家智能体 · 基于 LobeChat Agent 协议 · 用户暂不能上传
        </p>
      </header>

      {/* 分类 tab */}
      <div className="flex items-center gap-1 mb-6 border-b border-black/[0.06]">
        {CATEGORIES.map((c, i) => (
          <button
            key={c.id}
            className={cn(
              'h-10 px-4 text-[13px] font-medium transition-colors relative',
              i === 0 ? 'text-foreground' : 'text-foreground/55 hover:text-foreground/80',
            )}
          >
            {c.label}
            {i === 0 && (
              <motion.span
                layoutId="expert-cat-indicator"
                className="absolute bottom-0 left-2 right-2 h-[2px] bg-foreground rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      {/* 专家卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {EXPERTS.map((e, i) => {
          const Icon = e.icon;
          return (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              whileHover={{ y: -2 }}
              className="group p-5 rounded-2xl border border-black/[0.06] bg-white hover:border-black/15 hover:shadow-md transition-all cursor-pointer"
            >
              {/* 头部：渐变方块 + 图标 */}
              <div className="flex items-start gap-3 mb-3">
                <div className={cn('size-12 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 shadow-sm', e.gradient)}>
                  <Icon className="size-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-semibold leading-snug">{e.name}</h3>
                  <p className="text-[11px] text-foreground/50 mt-0.5">{e.role}</p>
                </div>
              </div>
              <p className="text-[12px] text-foreground/60 leading-relaxed line-clamp-2 mb-3">{e.description}</p>
              <div className="flex items-center gap-3 text-[11px] text-foreground/50">
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="size-3" />
                  {e.uses.toLocaleString()} 次使用
                </span>
                <span>·</span>
                <span>★ {e.rating}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="mt-8 text-[12px] text-foreground/40">
        💡 用户上传专家功能即将开放 · 关注公告
      </p>
    </div>
  );
}
