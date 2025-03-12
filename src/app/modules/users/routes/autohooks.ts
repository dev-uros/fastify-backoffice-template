import { FastifyPluginAsync } from "fastify";


const defaultRouteAutoHooks: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("onRequest", async (request, reply) => {
    await fastify.authenticate(request, reply);

  });
};

export default defaultRouteAutoHooks;
