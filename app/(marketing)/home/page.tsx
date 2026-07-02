'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import {
  ArrowUpRight,
  Sparkles,
  MessageSquare,
  Database,
  BookOpen,
  Brain,
  Globe,
  Zap,
  Users,
  Award,
  TrendingUp,
} from 'lucide-react';

export default function MarketingHome() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div className="min-h-[100dvh] bg-white text-foreground">
      {/* ── Nav ── */}
      <nav className="fixed top-0 inset-x-0 z-50 h-16 border-b border-black/[0.04] bg-white/80 backdrop-blur-xl">
        <div className="max-w-[1200px] mx-auto h-full px-6 flex items-center justify-between">
          <Link href="/home" className="flex items-center gap-2">
            <div className="size-7 rounded-md bg-gradient-to-br from-[#0066FF] to-[#0044CC] flex items-center justify-center">
              <Sparkles className="size-4 text-white" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight">睿智 AI</span>
          </Link>
          <div className="hidden md:flex items-center gap-7 text-[13px] text-foreground/65">
            <a href="#capabilities" className="hover:text-foreground transition-colors">能力</a>
            <a href="#experts" className="hover:text-foreground transition-colors">专家</a>
            <a href="#cases" className="hover:text-foreground transition-colors">案例</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">定价</a>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/chat"
              className="hidden md:inline-flex h-9 px-4 items-center text-[13px] font-medium text-foreground/75 hover:text-foreground transition-colors"
            >
              登录
            </Link>
            <Link
              href="/chat"
              className="inline-flex h-9 px-4 items-center gap-1.5 bg-foreground text-background rounded-lg text-[13px] font-medium hover:opacity-90 active:scale-[0.98] transition-all"
            >
              <span>开始使用</span>
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative pt-32 pb-24 overflow-hidden">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-[1200px] mx-auto px-6"
        >
          {/* 顶部小标 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center mb-6"
          >
            <span className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-[#0066FF]/[0.06] text-[11px] font-medium text-[#0066FF] border border-[#0066FF]/15">
              <span className="size-1.5 rounded-full bg-[#0066FF] animate-pulse" />
              v1.0 · 多 Agent 协同工作台
            </span>
          </motion.div>

          {/* 主标题 */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center font-semibold tracking-[-0.04em] leading-[0.95]"
          >
            <span className="block text-[64px] md:text-[112px] lg:text-[140px] text-foreground">
              让人机协同
            </span>
            <span className="block text-[64px] md:text-[112px] lg:text-[140px] bg-gradient-to-br from-[#0066FF] via-[#0052CC] to-[#7C3AED] bg-clip-text text-transparent">
              成为本能
            </span>
          </motion.h1>

          {/* 副标 */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 mx-auto max-w-[640px] text-center text-[16px] md:text-[18px] text-foreground/55 leading-relaxed"
          >
            基于 OpenClaw 多 Agent 架构 + LobeChat 专家协议
            <br />
            把分散的 AI 能力，汇聚成可被组织沉淀的智能资产
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex items-center justify-center gap-3"
          >
            <Link
              href="/chat"
              className="inline-flex h-12 px-7 items-center gap-2 bg-foreground text-background rounded-full text-[14px] font-medium hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-foreground/10"
            >
              <span>立即开始</span>
              <ArrowUpRight className="size-4" />
            </Link>
            <a
              href="#capabilities"
              className="inline-flex h-12 px-7 items-center gap-2 bg-black/[0.04] text-foreground rounded-full text-[14px] font-medium hover:bg-black/[0.06] active:scale-[0.98] transition-all"
            >
              <span>了解更多</span>
            </a>
          </motion.div>

          {/* 数据条 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-20 flex items-center justify-center gap-12 md:gap-20 text-center"
          >
            {[
              { value: '12+', label: '预置专家' },
              { value: '8', label: '多 Agent 协同' },
              { value: '∞', label: '知识沉淀' },
              { value: '24/7', label: '在线服务' },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-[28px] md:text-[36px] font-semibold tracking-tight tabular-nums">{s.value}</p>
                <p className="mt-1 text-[12px] text-foreground/50">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* 背景装饰 */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 size-[600px] bg-gradient-radial from-[#0066FF]/[0.08] to-transparent rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 size-[500px] bg-gradient-radial from-[#7C3AED]/[0.06] to-transparent rounded-full blur-3xl" />
        </div>
      </section>

      {/* ── Capabilities ── */}
      <section id="capabilities" className="py-32 border-t border-black/[0.04]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="max-w-[640px] mb-16">
            <p className="text-[12px] font-medium text-[#0066FF] uppercase tracking-wider">核心能力</p>
            <h2 className="mt-3 text-[44px] md:text-[56px] font-semibold tracking-tight leading-[1.1]">
              一个工作台
              <br />
              解决 AI 落地全链路
            </h2>
            <p className="mt-4 text-[15px] text-foreground/55 leading-relaxed">
              从对话到沉淀，从专家到课程，从个人到组织
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                icon: MessageSquare,
                title: '多 Agent 对话',
                desc: '基于 OpenClaw 架构，AI 自动调度最合适的专家组合来回答你的问题',
                gradient: 'from-blue-500 to-cyan-500',
              },
              {
                icon: Brain,
                title: '专家中心',
                desc: 'LobeChat Agent 协议，12+ 预置专家：技术 / 商业 / 创意 / 学术 / 生活',
                gradient: 'from-purple-500 to-pink-500',
              },
              {
                icon: Database,
                title: '知识库',
                desc: '上传文档、收藏聊天、订阅公开知识 — 全部接入 AI 助理，让回答有据可依',
                gradient: 'from-emerald-500 to-teal-500',
              },
              {
                icon: BookOpen,
                title: '多 Agent 课堂',
                desc: 'OpenMAIC 引擎 — 把专家编织成结构化课程，支持官方预置和用户自制',
                gradient: 'from-amber-500 to-orange-500',
              },
              {
                icon: Globe,
                title: '共享空间',
                desc: '把知识库 / 课程公开，全平台用户可订阅，沉淀组织智能资产',
                gradient: 'from-rose-500 to-pink-500',
              },
              {
                icon: Zap,
                title: '极致体验',
                desc: '奢侈品级 UI 打磨，每一次交互都是享受',
                gradient: 'from-indigo-500 to-blue-500',
              },
            ].map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="group p-6 rounded-2xl border border-black/[0.06] bg-white hover:border-black/15 hover:shadow-lg transition-all"
                >
                  <div
                    className={`size-11 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center mb-4`}
                  >
                    <Icon className="size-5 text-white" />
                  </div>
                  <h3 className="text-[18px] font-semibold mb-2">{c.title}</h3>
                  <p className="text-[13px] text-foreground/60 leading-relaxed">{c.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Showcase ── */}
      <section id="experts" className="py-32 bg-gradient-to-b from-white to-black/[0.01]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[12px] font-medium text-[#0066FF] uppercase tracking-wider">专家矩阵</p>
            <h2 className="mt-3 text-[44px] md:text-[56px] font-semibold tracking-tight">
              12 位专家，待命
            </h2>
            <p className="mt-4 text-[15px] text-foreground/55 max-w-[480px] mx-auto">
              技术、商业、创意、学术、生活 — 各领域顶尖专家随时可调度
            </p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { name: '代码架构师', gradient: 'from-blue-500 to-indigo-600' },
              { name: '商业顾问', gradient: 'from-emerald-500 to-teal-600' },
              { name: '文案大师', gradient: 'from-pink-500 to-rose-600' },
              { name: '数据分析师', gradient: 'from-cyan-500 to-blue-600' },
              { name: '数学教练', gradient: 'from-violet-500 to-purple-600' },
              { name: '科研助手', gradient: 'from-amber-500 to-orange-600' },
              { name: '心理咨询师', gradient: 'from-rose-500 to-pink-600' },
              { name: 'DevOps 工程师', gradient: 'from-slate-600 to-slate-800' },
              { name: 'PPT 设计师', gradient: 'from-fuchsia-500 to-pink-600' },
              { name: '翻译官', gradient: 'from-teal-500 to-emerald-600' },
              { name: '法务顾问', gradient: 'from-red-500 to-rose-600' },
              { name: '财务顾问', gradient: 'from-green-500 to-emerald-600' },
            ].map((e, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                className={`aspect-square rounded-2xl bg-gradient-to-br ${e.gradient} p-4 flex items-end cursor-pointer hover:scale-105 transition-transform shadow-sm`}
              >
                <p className="text-white text-[12px] font-medium leading-tight">{e.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Case ── */}
      <section id="cases" className="py-32 border-t border-black/[0.04]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Users, value: '10,000+', label: '活跃用户' },
              { icon: TrendingUp, value: '300%', label: '效率提升' },
              { icon: Award, value: '4.9 / 5', label: '用户评分' },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-2xl border border-black/[0.06] bg-white"
                >
                  <Icon className="size-6 text-[#0066FF] mb-4" />
                  <p className="text-[48px] font-semibold tracking-tight tabular-nums">{s.value}</p>
                  <p className="mt-2 text-[13px] text-foreground/55">{s.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0066FF] via-[#0044CC] to-[#7C3AED] p-12 md:p-20 text-center text-white">
            <h2 className="text-[40px] md:text-[60px] font-semibold tracking-tight leading-[1.05]">
              开始你的人机协同
              <br />
              进化之旅
            </h2>
            <p className="mt-4 text-[15px] text-white/75 max-w-[480px] mx-auto">
              免费版即可使用核心功能 · 无需信用卡 · 30 秒完成注册
            </p>
            <Link
              href="/chat"
              className="mt-8 inline-flex h-12 px-7 items-center gap-2 bg-white text-foreground rounded-full text-[14px] font-medium hover:bg-white/95 active:scale-[0.98] transition-all"
            >
              <span>立即开始</span>
              <ArrowUpRight className="size-4" />
            </Link>
            <div className="absolute inset-0 -z-10 opacity-30">
              <div className="absolute top-0 left-1/4 size-[400px] bg-white/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 size-[300px] bg-white/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 border-t border-black/[0.06]">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[13px] text-foreground/55">
            <div className="size-5 rounded bg-gradient-to-br from-[#0066FF] to-[#0044CC] flex items-center justify-center">
              <Sparkles className="size-3 text-white" />
            </div>
            <span>© 2026 睿智 AI</span>
          </div>
          <div className="flex items-center gap-6 text-[12px] text-foreground/45">
            <a href="#" className="hover:text-foreground/75 transition-colors">隐私政策</a>
            <a href="#" className="hover:text-foreground/75 transition-colors">服务条款</a>
            <a href="#" className="hover:text-foreground/75 transition-colors">联系我们</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
