'use client';

import { motion } from 'motion/react';
import { User, Bell, Shield, CreditCard, LogOut, ChevronRight } from 'lucide-react';

const SECTIONS = [
  { id: 'account', label: '账号信息', icon: User, desc: '昵称、头像、邮箱' },
  { id: 'notifications', label: '通知设置', icon: Bell, desc: '邮件、站内、推送' },
  { id: 'security', label: '安全', icon: Shield, desc: '密码、双因素认证' },
  { id: 'billing', label: '订阅与账单', icon: CreditCard, desc: '当前方案：免费版' },
];

export default function ProfilePage() {
  return (
    <div className="px-8 py-8 max-w-[720px] mx-auto">
      <header className="mb-6">
        <h1 className="text-[28px] font-semibold tracking-tight">个人中心</h1>
        <p className="mt-1 text-[13px] text-foreground/55">账号、订阅、安全</p>
      </header>

      {/* 用户卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-2xl border border-black/[0.06] bg-white flex items-center gap-4 mb-4"
      >
        <div className="size-14 rounded-full bg-gradient-to-br from-[#0066FF] to-[#7C3AED] flex items-center justify-center text-white text-lg font-semibold">
          U
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-[16px] font-semibold">未登录用户</h2>
          <p className="text-[12px] text-foreground/50 mt-0.5">登录后同步数据 · 跨设备访问</p>
        </div>
        <button className="h-9 px-4 rounded-lg bg-foreground text-background text-[13px] font-medium hover:opacity-90 active:scale-[0.98] transition-all">
          登录 / 注册
        </button>
      </motion.div>

      {/* 设置项 */}
      <div className="rounded-2xl border border-black/[0.06] bg-white overflow-hidden">
        {SECTIONS.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.button
              key={s.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="w-full flex items-center gap-3 px-5 h-16 hover:bg-black/[0.02] transition-colors text-left border-b last:border-b-0 border-black/[0.04]"
            >
              <div className="size-9 rounded-lg bg-black/[0.04] flex items-center justify-center">
                <Icon className="size-4 text-foreground/65" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium">{s.label}</p>
                <p className="text-[11px] text-foreground/50">{s.desc}</p>
              </div>
              <ChevronRight className="size-4 text-foreground/30" />
            </motion.button>
          );
        })}
      </div>

      {/* 退出 */}
      <button className="mt-4 w-full h-12 rounded-2xl border border-black/[0.06] bg-white text-[13px] text-foreground/55 hover:bg-black/[0.02] transition-colors flex items-center justify-center gap-2">
        <LogOut className="size-3.5" />
        退出登录
      </button>

      <p className="mt-6 text-center text-[11px] text-foreground/30">
        睿智 AI · v0.1.0
      </p>
    </div>
  );
}
