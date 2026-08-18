/**
 * In-Memory Token Bucket Rate Limiter
 * Provides thread-safe token bucket rate limiting for app/api/ routes.
 */

interface RateLimitBucket {
  tokens: number;
  lastRefill: number;
}

interface RateLimitConfig {
  maxTokens: number;      // Maximum bucket capacity (e.g. 60 requests)
  refillRatePerSec: number; // Tokens refilled per second (e.g. 1 token/sec)
  windowMs: number;       // Window duration for headers (e.g. 60000 ms)
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxTokens: 60,
  refillRatePerSec: 1,
  windowMs: 60000,
};

const buckets = new Map<string, RateLimitBucket>();

/**
 * Evaluates rate limit for a client IP / identifier.
 * Returns true if request is permitted, false if rate limit is breached.
 */
export function checkRateLimit(
  identifier: string,
  config: Partial<RateLimitConfig> = {}
): {
  success: boolean;
  limit: number;
  remaining: number;
  resetInSeconds: number;
} {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const now = Date.now();

  let bucket = buckets.get(identifier);

  if (!bucket) {
    bucket = {
      tokens: cfg.maxTokens - 1,
      lastRefill: now,
    };
    buckets.set(identifier, bucket);
    return {
      success: true,
      limit: cfg.maxTokens,
      remaining: bucket.tokens,
      resetInSeconds: Math.ceil(cfg.windowMs / 1000),
    };
  }

  // Refill tokens based on elapsed time
  const elapsedSec = (now - bucket.lastRefill) / 1000;
  const tokensToAdd = elapsedSec * cfg.refillRatePerSec;

  bucket.tokens = Math.min(cfg.maxTokens, bucket.tokens + tokensToAdd);
  bucket.lastRefill = now;

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    buckets.set(identifier, bucket);
    return {
      success: true,
      limit: cfg.maxTokens,
      remaining: Math.floor(bucket.tokens),
      resetInSeconds: Math.ceil((cfg.maxTokens - bucket.tokens) / cfg.refillRatePerSec),
    };
  }

  // Rate limit breached
  return {
    success: false,
    limit: cfg.maxTokens,
    remaining: 0,
    resetInSeconds: Math.ceil((1 - bucket.tokens) / cfg.refillRatePerSec),
  };
}

/**
 * Resets memory bucket store (useful for testing).
 */
export function resetRateLimiterStore(): void {
  buckets.clear();
}
