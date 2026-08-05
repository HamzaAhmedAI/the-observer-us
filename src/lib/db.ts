/* ============================================================
   The Observer US — Database Client (Supabase)
   Subscriber CRUD, push subscription management.
   ============================================================ */

import { createClient } from '@supabase/supabase-js'

// ─── Client Initialization ──────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL ?? ''
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY ?? ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

const USE_MOCK = !SUPABASE_URL || !SUPABASE_SERVICE_KEY

/**
 * Admin client (service role) — for API route usage.
 * Operates with full RLS bypass.
 */
function getAdminClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return null
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false },
  })
}

/**
 * Public client (anon key) — for browser usage.
 * RLS-enforced.
 */
export function getPublicClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

// ─── Types ──────────────────────────────────────────────────
export interface Subscriber {
  id: string
  email: string
  categories: string[]
  is_active: boolean
  subscribed_at: string
  updated_at: string
}

export interface PushSubscription {
  id: string
  subscriber_id?: string
  endpoint: string
  p256dh: string
  auth: string
  categories: string[]
  created_at: string
}

// ─── Subscriber Operations ──────────────────────────────────

export async function createSubscriber(
  email: string,
  categories: string[] = []
): Promise<{ data?: Subscriber; error?: string }> {
  if (USE_MOCK) {
    console.log('[DB Mock] createSubscriber:', { email, categories })
    return { data: { id: crypto.randomUUID(), email, categories, is_active: true, subscribed_at: new Date().toISOString(), updated_at: new Date().toISOString() } }
  }

  const client = getAdminClient()
  if (!client) return { error: 'Database not configured' }

  const { data, error } = await client
    .from('subscribers')
    .upsert({ email, categories }, { onConflict: 'email' })
    .select()
    .single()

  if (error) return { error: error.message }
  return { data }
}

export async function getSubscriberByEmail(
  email: string
): Promise<{ data?: Subscriber; error?: string }> {
  if (USE_MOCK) {
    return { data: { id: crypto.randomUUID(), email, categories: [], is_active: true, subscribed_at: new Date().toISOString(), updated_at: new Date().toISOString() } }
  }

  const client = getAdminClient()
  if (!client) return { error: 'Database not configured' }

  const { data, error } = await client
    .from('subscribers')
    .select('*')
    .eq('email', email)
    .single()

  if (error) return { error: error.message }
  return { data }
}

export async function updateSubscriberCategories(
  email: string,
  categories: string[]
): Promise<{ data?: Subscriber; error?: string }> {
  if (USE_MOCK) {
    console.log('[DB Mock] updateCategories:', { email, categories })
    return { data: { id: crypto.randomUUID(), email, categories, is_active: true, subscribed_at: new Date().toISOString(), updated_at: new Date().toISOString() } }
  }

  const client = getAdminClient()
  if (!client) return { error: 'Database not configured' }

  const { data, error } = await client
    .from('subscribers')
    .update({ categories, updated_at: new Date().toISOString() })
    .eq('email', email)
    .select()
    .single()

  if (error) return { error: error.message }
  return { data }
}

export async function deleteSubscriber(
  email: string
): Promise<{ error?: string }> {
  if (USE_MOCK) {
    console.log('[DB Mock] deleteSubscriber:', { email })
    return {}
  }

  const client = getAdminClient()
  if (!client) return { error: 'Database not configured' }

  const { error } = await client
    .from('subscribers')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('email', email)

  if (error) return { error: error.message }
  return {}
}

export async function getActiveSubscribers(): Promise<{
  data?: Subscriber[]
  error?: string
}> {
  if (USE_MOCK) {
    return { data: [] }
  }

  const client = getAdminClient()
  if (!client) return { error: 'Database not configured' }

  const { data, error } = await client
    .from('subscribers')
    .select('*')
    .eq('is_active', true)

  if (error) return { error: error.message }
  return { data }
}

// ─── Push Subscription Operations ───────────────────────────

export async function createPushSubscription(
  subscription: {
    endpoint: string
    p256dh: string
    auth: string
    categories?: string[]
  }
): Promise<{ data?: PushSubscription; error?: string }> {
  if (USE_MOCK) {
    console.log('[DB Mock] createPushSubscription:', subscription)
    return { data: { id: crypto.randomUUID(), ...subscription, categories: subscription.categories ?? [], created_at: new Date().toISOString() } }
  }

  const client = getAdminClient()
  if (!client) return { error: 'Database not configured' }

  const { data, error } = await client
    .from('push_subscribers')
    .upsert({ endpoint: subscription.endpoint, p256dh: subscription.p256dh, auth: subscription.auth, categories: subscription.categories ?? [] }, { onConflict: 'endpoint' })
    .select()
    .single()

  if (error) return { error: error.message }
  return { data }
}

export async function getPushSubscriptionsByCategory(
  category: string
): Promise<{ data?: PushSubscription[]; error?: string }> {
  if (USE_MOCK) {
    return { data: [] }
  }

  const client = getAdminClient()
  if (!client) return { error: 'Database not configured' }

  const { data, error } = await client
    .from('push_subscribers')
    .select('*')
    .contains('categories', [category])

  if (error) return { error: error.message }
  return { data }
}

export async function deletePushSubscription(
  endpoint: string
): Promise<{ error?: string }> {
  if (USE_MOCK) {
    console.log('[DB Mock] deletePushSubscription:', { endpoint })
    return {}
  }

  const client = getAdminClient()
  if (!client) return { error: 'Database not configured' }

  const { error } = await client
    .from('push_subscribers')
    .delete()
    .eq('endpoint', endpoint)

  if (error) return { error: error.message }
  return {}
}
