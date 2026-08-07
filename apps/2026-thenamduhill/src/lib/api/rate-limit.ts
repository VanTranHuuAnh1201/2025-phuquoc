/**
 * Simple in-memory token bucket rate limiter for public API routes.
 *
 * NOTE: Multi-instance deployments (e.g. Vercel Serverless) do not share this in-memory state.
 * This acts as a best-effort local mitigation for v1.0.0. Redis/Upstash upgrade planned for v1.1.
 */

interface RateLimitEntry {
    count: number
    resetTime: number
}

const buckets = new Map<string, RateLimitEntry>()

/**
 * Checks if request from specified IP is within limit.
 *
 * @param ip Client IP address
 * @param limit Max requests per window (default 60)
 * @param windowMs Window duration in ms (default 60,000ms = 1 minute)
 */
export function checkRateLimit(
    ip: string,
    limit = 60,
    windowMs = 60_000,
): { allowed: boolean; remaining: number; resetAfterSec: number } {
    const now = Date.now()
    const entry = buckets.get(ip)

    if (!entry || now > entry.resetTime) {
        buckets.set(ip, {
            count: 1,
            resetTime: now + windowMs,
        })
        return {
            allowed: true,
            remaining: limit - 1,
            resetAfterSec: Math.ceil(windowMs / 1000),
        }
    }

    if (entry.count >= limit) {
        return {
            allowed: false,
            remaining: 0,
            resetAfterSec: Math.ceil((entry.resetTime - now) / 1000),
        }
    }

    entry.count += 1
    return {
        allowed: true,
        remaining: limit - entry.count,
        resetAfterSec: Math.ceil((entry.resetTime - now) / 1000),
    }
}
