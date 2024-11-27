import { createFactory } from 'hono/factory';
import { program } from './commands.js';
import { getCache } from './cache.js';
import xior from './xior.js';
import { XiorError } from 'xior';
import type { StatusCode } from 'hono/utils/http-status';

const factory = createFactory();

const { origin }: { origin: string } = program.opts();
const cache = getCache();

export const cacheHandler = factory.createHandlers(async (c) => {
    if (!origin) return c.json({ message: 'Origin must be specified.' }, 400);
    if (c.req.path === '/')
        return c.body(`Visit https://dummyjson.com/docs for paths.`, 200);

    // prettier-ignore
    const url = `${origin.replace(/\/+$/, '')}/${c.req.path.replace(/^\/+/, '')}`;
    console.log(`Forwarding request to ${url}`);

    const cachedData = await cache.get(url);
    if (cachedData) {
        c.header('X-Cache', 'HIT');
        return c.json(cachedData, 200);
    }

    try {
        const response = await xior.get(`${url}`);
        const data = response.data;

        await cache.set(url, data);

        c.header('X-Cache', 'MISS');
        return c.json(data, 200);
    } catch (error) {
        if (error instanceof XiorError && error.response) {
            console.error(
                `Request failed with status code ${error.response.status}`
            );
            return c.body(
                error.response.data,
                error.response.status as StatusCode
            );
        }

        console.error(error);
        return c.json(
            {
                message: 'Something went wrong while fetching the data.',
            },
            500
        );
    }
});
