const rateLimitStore = new Map();

export function customRateLimiter(ip = "local-user") {
    const maxRequests = 10;
    const windowMs = 60 * 1000; // 1 minute
    const now = Date.now();

    if (!rateLimitStore.has(ip)) {
        rateLimitStore.set(ip, { count: 1, lastReset: now });
        return { allowed: true };
    }

    const user = rateLimitStore.get(ip);

    if (now - user.lastReset > windowMs) {
        user.count = 1;
        user.lastReset = now;
        return { allowed: true };
    }

    if (user.count >= maxRequests) {
        return {
            allowed: false,
            retryAfter: (user.lastReset + windowMs - now) / 1000
        };
    }

    user.count++;
    return { allowed: true };
}