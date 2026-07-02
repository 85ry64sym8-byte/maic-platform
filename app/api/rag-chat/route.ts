import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const maxDuration = 60

/**
 * RAG Chat API
 *
 * POST /api/rag-chat
 *   body: { question: string, history?: { role, content }[] }
 *   returns: { answer, sources: [{ title, category, similarity }] }
 *
 * Pipeline:
 *   1) Get current user's org_id (multi-tenant isolation)
 *   2) Naive keyword search in knowledge_docs (over 37 docs, good enough for v1)
 *   3) Take top-5 chunks
 *   4) Call DeepSeek with system prompt containing the context
 *   5) Return answer + source citations
 */
const SYSTEM_PROMPT = `你是"人机协同 AI 训战平台"的智能学习助手。

# 你的角色
你是一个面向企业管理者与员工的 AI 学习教练，负责基于企业知识库回答问题、解释概念、给出可操作建议。

# 行为准则
1. **优先基于知识库回答**：当用户的问题与知识库内容相关时，优先引用并总结知识库内容。
2. **回答结构清晰**：使用 Markdown 标题、列表、表格，避免大段无序文字。
3. **承认不知道**：当知识库没有相关信息时，诚实告知并给出探索建议，不要编造。
4. **引导学习**：在回答末尾，可适当引导用户深入学习（如推荐相关课程或追问）。
5. **中文优先**：用户用中文提问时用中文回答；用英文时用英文回答。

# 输出格式
- 使用清晰的 Markdown 结构
- 关键结论用粗体
- 必要时用表格或代码块
- 末尾附"📚 参考文档"列出引用的资料`

interface ChatRequest {
  question: string
  history?: { role: 'user' | 'assistant'; content: string }[]
}

function makeSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

/** Naive keyword scoring: count of query tokens appearing in title/content + category weight */
function searchDocs(
  docs: { id: string; title: string; content: string | null; category: string | null }[],
  query: string,
  topK: number
) {
  const tokens = query
    .toLowerCase()
    .split(/[\s,。、！？?!;；:：]+/)
    .filter((t) => t.length >= 2)
  if (tokens.length === 0) return []

  const scored = docs.map((d) => {
    const text = `${d.title} ${d.content ?? ''}`.toLowerCase()
    let score = 0
    for (const t of tokens) {
      const idx = text.indexOf(t)
      if (idx >= 0) {
        // Title hit worth more
        if (d.title.toLowerCase().includes(t)) score += 5
        else score += 1
        // Earlier positions worth a bit more
        if (idx < 200) score += 0.5
      }
    }
    return { ...d, score }
  })

  return scored
    .filter((d) => d.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
}

function truncate(s: string, max: number) {
  if (s.length <= max) return s
  return s.slice(0, max) + '…'
}

async function callDeepSeek(
  messages: { role: string; content: string }[]
): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY is not configured')
  }
  const base = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com'
  const model = process.env.DEFAULT_MODEL || 'deepseek-chat'

  const resp = await fetch(`${base}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.5,
      max_tokens: 1500,
    }),
  })

  if (!resp.ok) {
    const text = await resp.text()
    throw new Error(`DeepSeek ${resp.status}: ${text}`)
  }
  const data = await resp.json()
  return data.choices?.[0]?.message?.content ?? '(空响应)'
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequest
    const question = (body.question || '').trim()
    if (!question) {
      return NextResponse.json({ error: 'question is required' }, { status: 400 })
    }
    const history = Array.isArray(body.history) ? body.history.slice(-6) : []

    // 1) Get user → org_id (graceful fallback: pick the first org)
    const supabase = makeSupabaseAdmin()
    const authHeader = req.headers.get('authorization')
    let orgId: string | null = null
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7)
      const { data: userData } = await supabase.auth.getUser(token)
      const userId = userData?.user?.id
      if (userId) {
        const { data: prof } = await supabase
          .from('profiles')
          .select('org_id')
          .eq('id', userId)
          .maybeSingle()
        orgId = prof?.org_id ?? null
      }
    }
    if (!orgId) {
      const { data: orgs } = await supabase
        .from('organizations')
        .select('id')
        .limit(1)
      orgId = orgs?.[0]?.id ?? null
    }
    if (!orgId) {
      return NextResponse.json(
        { error: 'no organization configured; run import_knowledge.py first' },
        { status: 503 }
      )
    }

    // 2) Search docs
    const { data: docs, error: docsErr } = await supabase
      .from('knowledge_docs')
      .select('id,title,content,category')
      .eq('org_id', orgId)
      .eq('status', 'active')
    if (docsErr) {
      return NextResponse.json({ error: docsErr.message }, { status: 500 })
    }
    const top = searchDocs(docs ?? [], question, 5)

    // 3) Build context
    const context = top.length
      ? top
          .map(
            (d, i) =>
              `【资料 ${i + 1}】分类：${d.category ?? '未分类'}\n标题：${d.title}\n内容：\n${truncate(d.content ?? '', 1200)}`
          )
          .join('\n\n---\n\n')
      : '（知识库暂无匹配资料，请基于通用知识回答并提示用户。' +
        '）'

    // 4) Build messages
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'system',
        content: `# 知识库检索结果（按相关度排序）\n\n${context}\n\n---\n请基于以上资料回答用户问题。若资料不足，请明确告知。`,
      },
      ...history.map((h) => ({ role: h.role, content: h.content })),
      { role: 'user', content: question },
    ]

    // 5) Call LLM
    const answer = await callDeepSeek(messages)

    // 6) Persist conversation
    try {
      const authHeader2 = req.headers.get('authorization')
      if (authHeader2?.startsWith('Bearer ')) {
        const token = authHeader2.slice(7)
        const { data: u } = await supabase.auth.getUser(token)
        if (u?.user) {
          await supabase.from('conversations').insert({
            user_id: u.user.id,
            org_id: orgId,
            type: 'chat',
            title: truncate(question, 60),
            messages: [
              { role: 'user', content: question, ts: Date.now() },
              { role: 'assistant', content: answer, ts: Date.now() },
            ],
            context: {
              sources: top.map((d) => ({
                id: d.id,
                title: d.title,
                category: d.category,
                score: d.score,
              })),
            },
          })
        }
      }
    } catch {
      // Non-fatal: log and continue
      console.warn('Failed to persist conversation (non-fatal)')
    }

    return NextResponse.json({
      answer,
      sources: top.map((d) => ({
        id: d.id,
        title: d.title,
        category: d.category,
        score: d.score,
      })),
    })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    console.error('[rag-chat]', e)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
