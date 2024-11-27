import { Keyv } from 'keyv';
import KeyvSqlite from '@keyv/sqlite';
import { createCache } from 'cache-manager';
import ms from 'ms';

let cache: ReturnType<typeof createCache> | null = null;

export const getCache = () => {
    if (!cache) {
        const store = new KeyvSqlite({
            table: 'caches',
            uri: 'sqlite://./caches.sqlite',
        });
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
