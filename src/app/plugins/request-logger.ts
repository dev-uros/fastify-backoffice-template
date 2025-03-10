import fp from "fastify-plugin";

export default fp(async (fastify, opts) => {

    fastify.addHook('preHandler', async (request, reply) => {
        request.log.info({
            params: request.params,
            query: request.query,
            body: request.body
        }, 'Incoming request');
    })
})