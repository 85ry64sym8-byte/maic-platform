import { redirect } from 'next/navigation';

export default function Page() {
  // 默认进入营销首页
  // 已登录用户可在客户端组件里检测并跳到 /chat
  redirect('/home');
}
