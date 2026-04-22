const Redis = require('ioredis');
import { Redis } from '@upstash/redis'

const isRemote = process.env.REDIS_HOST && process.env.REDIS_HOST !== 'localhost';

const redis = new Redis({
    port: process.env.REDIS_PORT || 6380,
    host: process.env.REDIS_HOST || 'localhost',
    password: process.env.REDIS_PASSWORD || undefined,
    tls: isRemote ? {} : undefined,  // Upstash requires TLS
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    }
});

function generateCacheKey(req, data) {
    const baseUrl = req.path
        .replace(/^\/+|\/+$/g, '')  // remove leading/trailing slashes
        .replace(/\//g, ':');       // convert slashes to colons

    return `${baseUrl}:${data}`;
}

module.exports = { redis, generateCacheKey };
