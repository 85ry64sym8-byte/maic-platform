'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  Database,
  BookOpen,
  Sparkles,
  User,
  Globe,
  Settings,
  LogOut,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const PRIMARY_NAV: NavItem[] = [
  { href: '/chat', label: '新对话', icon: MessageSquare },
  { href: '/knowledge', label: '知识库', icon: Database },
  { href: '/courses', label: '课程库', icon: BookOpen },
  { href: '/experts', label: '专家中心', icon: Sparkles, badge: 'NEW' },
  { href: '/profile', label: '个人中心', icon: User },
];

const SECONDARY_NAV: NavItem[] = [
  { href: '/shared', label: '共享空间', icon: Globe, badge: 'BETA' },
];

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [recentExpanded, setRecentExpanded] = useState(true);

  return (
    <div className="min-h-[100dvh] w-full bg-white text-foreground flex">
      {/* ─── 左侧 Sidebar (220px 固定) ─── */}
      <aside className="w-[220px] shrink-0 border-r border-black/[0.06] flex flex-col bg-white">
        {/* Logo */}
        <div className="h-16 px-5 flex items-center">
          <Link
            href="/home"
            className="flex items-center gap-2 group"
            aria-label="返回首页"
          >
            <div className="size-7 rounded-md bg-gradient-to-br from-[#0066FF] to-[#0044CC] flex items-center justify-center">
              <Sparkles className="size-4 text-white" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight text-foreground">
              睿智 AI
            </span>
          </Link>
        </div>

        {/* 新建对话按钮 */}
        <div className="px-3 pb-3">
          <button
            onClick={() => router.push('/chat')}
            className="w-full flex items-center gap-2 px-3 h-9 rounded-lg bg-foreground text-background text-[13px] font-medium hover:opacity-90 active:scale-[0.98] transition-all"
          >
            <Plus className="size-4" />
            <span>新建对话</span>
          </button>
        </div>

        {/* 主导航 */}
        <nav className="flex-1 overflow-y-auto px-2 py-1">
          <ul className="space-y-0.5">
            {PRIMARY_NAV.map((item) => {
              const active = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'relative flex items-center gap-2.5 px-3 h-9 rounded-lg text-[13px] font-medium transition-colors group',
                      active
                        ? 'bg-[#0066FF]/[0.08] text-[#0066FF]'
                        : 'text-foreground/70 hover:bg-black/[0.04] hover:text-foreground',
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="app-nav-indicator"
                        className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full bg-[#0066FF]"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Icon className="size-4" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          'text-[9px] font-semibold px-1.5 h-4 inline-flex items-center rounded-full',
                          item.badge === 'NEW'
                            ? 'bg-[#0066FF]/[0.1] text-[#0066FF]'
                            : 'bg-foreground/[0.06] text-foreground/50',
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* 最近对话（占位） */}
          <div className="mt-6">
            <button
              onClick={() => setRecentExpanded(!recentExpanded)}
              className="w-full flex items-center justify-between px-3 h-6 text-[11px] font-medium text-foreground/40 hover:text-foreground/60 transition-colors uppercase tracking-wider"
            >
              <span>最近对话</span>
              <motion.span
                animate={{ rotate: recentExpanded ? 0 : -90 }}
                transition={{ duration: 0.2 }}
                className="inline-flex"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M2.5 3.75L5 6.25L7.5 3.75"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {recentExpanded && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="overflow-hidden mt-1 space-y-0.5"
                >
                  {['AI 能从项目方案到落地怎么做？', '如何制定 Q1 季度培训计划？'].map(
                    (title, i) => (
                      <li key={i}>
                        <button
                          className="w-full text-left px-3 py-1.5 text-[12px] text-foreground/50 hover:text-foreground/80 hover:bg-black/[0.03] rounded-md truncate transition-colors"
                          title={title}
                        >
                          {title}
                        </button>
                      </li>
                    ),
                  )}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* 底部分组：共享空间 */}
        <div className="px-2 py-3 border-t border-black/[0.06]">
          <ul className="space-y-0.5">
            {SECONDARY_NAV.map((item) => {
              const active = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'relative flex items-center gap-2.5 px-3 h-9 rounded-lg text-[13px] font-medium transition-colors',
                      active
                        ? 'bg-[#0066FF]/[0.08] text-[#0066FF]'
                        : 'text-foreground/70 hover:bg-black/[0.04] hover:text-foreground',
                    )}
                  >
                    <Icon className="size-4" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] font-semibold px-1.5 h-4 inline-flex items-center rounded-full bg-foreground/[0.06] text-foreground/50">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* 用户区 */}
        <div className="px-3 py-3 border-t border-black/[0.06] flex items-center gap-2">
          <div className="size-7 rounded-full bg-gradient-to-br from-[#0066FF] to-[#7C3AED] flex items-center justify-center text-white text-[11px] font-semibold">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium truncate">用户</p>
            <p className="text-[10px] text-foreground/40 truncate">免费版</p>
          </div>
          <button
            className="size-7 rounded-md hover:bg-black/[0.04] flex items-center justify-center text-foreground/40 hover:text-foreground/70 transition-colors"
            aria-label="设置"
          >
            <Settings className="size-3.5" />
          </button>
          <button
            className="size-7 rounded-md hover:bg-black/[0.04] flex items-center justify-center text-foreground/40 hover:text-foreground/70 transition-colors"
            aria-label="退出"
          >
            <LogOut className="size-3.5" />
          </button>
        </div>
      </aside>

      {/* ─── 右侧内容区 ─── */}
      <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
    </div>
  );
}
