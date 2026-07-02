/**
 * 组织/多租户工具函数
 */
import { createClient } from '@/lib/supabase/server'

export interface Organization {
  id: string
  name: string
  slug: string
  plan: 'free' | 'pro' | 'enterprise'
}

/**
 * 获取当前用户所属组织
 */
export async function getCurrentOrg() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('org_id, organizations(*)')
    .eq('id', user.id)
    .single()

  return profile?.organizations as unknown as Organization | null
}

/**
 * 验证用户是否属于指定组织
 */
export async function verifyOrgAccess(orgId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data: profile } = await supabase
    .from('profiles')
    .select('org_id')
    .eq('id', user.id)
    .single()

  return profile?.org_id === orgId
}

/**
 * 创建新组织
 */
export async function createOrganization(name: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
    .replace(/^-|-$/g, '')

  const { data: org, error } = await supabase
    .from('organizations')
    .insert({ name, slug })
    .select()
    .single()

  if (error) throw error

  // Assign user as org admin
  await supabase
    .from('profiles')
    .update({ org_id: org.id, role: 'org_admin' })
    .eq('id', user.id)

  return org
}
