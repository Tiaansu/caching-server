import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { getCache } from './cache.js';
import { program } from './commands.js';
import { cacheHandler } from './handlers.js';

const cache = getCache();

const {
    port,
    clearCache,
}: {
    origin: string;
    port: number;
    clearCache: boolean;
} = program.opts();
const app = new Hono();

if (clearCache) {
    console.log('Clearing cache please wait...');
    await cache.clear();
    console.log('Cleared cache.');
    process.exit(0);
}

app.get('*', ...cacheHandler);

serve(
    {
        fetch: app.fetch,
        port,
    },
    (info) => console.log(`Server is running on http://localhost:${info.port}.`)
);
