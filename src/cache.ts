import { Keyv } from 'keyv';
import { createCache } from 'cache-manager';
import ms from 'ms';
import { CacheableMemory } from 'cacheable';

let cache: ReturnType<typeof createCache> | null = null;

export const getCache = () => {
    if (!cache) {
        const store = new CacheableMemory({ ttl: ms('5m'), lruSize: 5000 });
        const keyv = new Keyv({
            store,
        });
        cache = createCache({
            stores: [keyv],
            ttl: ms('5m'),
        });
    }
    return cache;
};
