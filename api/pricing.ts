import type { VercelRequest, VercelResponse } from '@vercel/node'

// Base USD plans
const BASE_PLANS = {
  foundryos: [
    { name: 'Monthly', subheading: 'Flexible billing for FoundryOS', price: 21, period: 'month' },
    { name: 'Annual', subheading: 'Best value for FoundryOS', price: 222, period: 'year', savings: 12 },
  ],
  launchos: [
    { name: 'Monthly', subheading: 'Flexible billing for LaunchOS', price: 21, period: 'month' },
    { name: 'Annual', subheading: 'Best value for LaunchOS', price: 222, period: 'year', savings: 12 },
  ],
  bundle: [
    { name: 'Monthly', subheading: 'All agents included, billed monthly', price: 42, period: 'month' },
    { name: 'Annual', subheading: 'Save 20% with annual billing', price: 403, period: 'year', savings: 20 },
  ],
}

const INDIA_MULTIPLIER = 90

// Simple in-memory cache for ip -> { country, ts }
const IP_CACHE = new Map<string, { country: string | null; ts: number }>()
const CACHE_TTL_MS = 1000 * 60 * 60 // 1 hour

function sanitizeCountry(raw: string | null | undefined): string | null {
  if (!raw) return null
  const m = String(raw).trim().match(/[A-Za-z]{2}/)
  return m ? m[0].toUpperCase() : null
}

function cacheGet(ip: string): string | null | undefined {
  const entry = IP_CACHE.get(ip)
  if (!entry) return undefined
  if (Date.now() - entry.ts > CACHE_TTL_MS) {
    IP_CACHE.delete(ip)
    return undefined
  }
  return entry.country
}

function cacheSet(ip: string, country: string | null) {
  IP_CACHE.set(ip, { country, ts: Date.now() })
}

function extractClientIp(req: VercelRequest): string | null {
  const xf = (req.headers['x-forwarded-for'] as string) || ''
  const xReal = (req.headers['x-real-ip'] as string) || ''
  let ip = ''

  if (xf) ip = xf.split(',')[0].trim()
  else if (xReal) ip = xReal.trim()
  else if (req.socket && (req.socket as any).remoteAddress) ip = (req.socket as any).remoteAddress
  else if ((req as any).connection && (req as any).connection.remoteAddress) ip = (req as any).connection.remoteAddress

  if (!ip) return null
  if (ip.startsWith('::ffff:')) ip = ip.replace('::ffff:', '')
  if (ip === '::1' || ip === '127.0.0.1' || ip === '::') return null
  return ip
}

async function callIpApi(ip: string | null) {
  try {
    const url = ip ? `https://ipapi.co/${ip}/json/` : 'https://ipapi.co/json/'
    const resp = await fetch(url, { method: 'GET', headers: { 'Accept': 'application/json' } })
    if (!resp.ok) throw new Error(`ipapi responded ${resp.status}`)
    const data = await resp.json()
    return data
  } catch (err) {
    console.warn('ipapi lookup failed:', err)
    return null
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow OPTIONS for CORS preflight
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    // allow dev override for testing: ?country=IN
    const rawOverride = (req.query.country as string || '').trim() || null
    const overrideCountry = rawOverride ? (rawOverride.match(/[A-Za-z]{2}/)?.[0].toUpperCase() ?? null) : null

    let countryCode: string | null = null
    let detectionSource = 'none'

    if (overrideCountry) {
      countryCode = overrideCountry
      detectionSource = 'override'
      console.log('[api/pricing] using override country:', countryCode)
    } else {
      // 1) Check Vercel/Cloudflare headers that may provide country directly
      const headerCandidates = [
        (req.headers['x-vercel-ip-country'] as string) || null,
        (req.headers['x-now-country'] as string) || null,
        (req.headers['cf-ipcountry'] as string) || null,
        (req.headers['x-country-code'] as string) || null,
      ]
      for (const h of headerCandidates) {
        const c = sanitizeCountry(h)
        if (c) {
          countryCode = c
          detectionSource = 'header'
          console.log('[api/pricing] detected country from header:', countryCode)
          break
        }
      }

      if (!countryCode) {
        // 2) Try to extract client IP and use cache/ipapi
        const clientIp = extractClientIp(req)
        if (clientIp) {
          const cached = cacheGet(clientIp)
          if (cached !== undefined) {
            countryCode = cached
            detectionSource = 'cache'
            console.log('[api/pricing] country from cache for ip', clientIp, countryCode)
          } else {
            const ipapiResp = await callIpApi(clientIp)
            const rawCountry = ipapiResp && ipapiResp.country_code ? String(ipapiResp.country_code).trim() : null
            const sanitized = sanitizeCountry(rawCountry)
            countryCode = sanitized
            detectionSource = 'ipapi'
            cacheSet(clientIp, countryCode ?? null)
            console.log('[api/pricing] ipapi lookup for', clientIp, '->', countryCode)
          }
        } else {
          // 3) No client ip available (local dev). Try ipapi generic lookup
          const ipapiResp = await callIpApi(null)
          const rawCountry = ipapiResp && ipapiResp.country_code ? String(ipapiResp.country_code).trim() : null
          countryCode = sanitizeCountry(rawCountry)
          detectionSource = 'ipapi-generic'
          console.log('[api/pricing] generic ipapi lookup ->', countryCode)
        }
      }
    }

    const isIndia = countryCode === 'IN'
    const multiplier = isIndia ? INDIA_MULTIPLIER : 1
    const currency = isIndia ? 'INR' : 'USD'
    const symbol = isIndia ? '₹' : '$'

    const localized: Record<string, any> = {}
    for (const k of Object.keys(BASE_PLANS)) {
      localized[k] = (BASE_PLANS as any)[k].map((p: any) => ({
        ...p,
        localizedPrice: Math.round(p.price * multiplier * 100) / 100,
      }))
    }

    // Provide detectionSource for debugging and instrumentation
    return res.json({
      countryCode,
      detectionSource,
      currency,
      symbol,
      multiplier,
      plans: localized,
    })
  } catch (err: any) {
    console.error('pricing handler error:', err)
    // Fallback to USD
    const fallback: Record<string, any> = {}
    for (const k of Object.keys(BASE_PLANS)) {
      fallback[k] = (BASE_PLANS as any)[k].map((p: any) => ({ ...p, localizedPrice: p.price }))
    }
    return res.json({ countryCode: null, currency: 'USD', symbol: '$', multiplier: 1, plans: fallback })
  }
}
