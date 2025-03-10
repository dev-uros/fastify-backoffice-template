import fp from "fastify-plugin";
import fastifyRedis, {FastifyRedis} from "@fastify/redis";

export default fp(
    async (fastify, opts) => {

        //@ts-ignore
        await fastify.register(fastifyRedis, {
            host: 'redis',
            password: 'redis',
            port: 6379,
            db: 0,
            namespace: 'redisQueue',
            closeClient: true,
            maxRetriesPerRequest: null,
            enableOfflineQueue: false,
            retryStrategy: function(retries) {
                if (retries > 20) {
                    fastify.log.error('redisQueue error: Too many attempts to reconnect. Redis connection was terminated');
                    return new Error("Too many retries.");
                } else {
                    return retries * 500;
                }
            },
            connectTimeout: 10000,
        })


        //@ts-ignore
        await fastify.register(fastifyRedis, {
            host: 'redis',
            password: 'redis',
            port: 6379,
            db: 1,
            namespace: 'redisCron',
            closeClient: true,
            maxRetriesPerRequest: null,
            enableOfflineQueue: false,
            retryStrategy: function(retries) {
                if (retries > 20) {
                    fastify.log.error('redisCron error: Too many attempts to reconnect. Redis connection was terminated');
                    return new Error("Too many retries.");
                } else {
                    return retries * 500;
                }
            },
            connectTimeout: 10000,
        })


        fastify.redis['redisQueue'].on('error', (err) => {
            fastify.log.error('redisQueue error:' + err.message);
        });

        fastify.redis['redisCron'].on('error', (err) => {
            fastify.log.error('redisCron error:' + err.message);

        });

    }, {
        name: 'redis',
        dependencies: ['config']
    })

declare module 'fastify' {
    interface FastifyInstance {
        redisQueue: FastifyRedis; // Default Redis client for db 0
        redisCron: FastifyRedis; // Redis client for db 1 (cron jobs)
    }
}