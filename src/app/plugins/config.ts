import fp from 'fastify-plugin'
import fastifyEnv from '@fastify/env'
import {configSchema, ConfigSchemaType} from "../schemas/config.js";

export default fp(
    async (fastify, opts) => {
        fastify.register(fastifyEnv, {
            schema: configSchema,
            dotenv: true
        })
    },
    {
        name: 'config'
    }
)


declare module 'fastify' {
    interface FastifyInstance {
        config: ConfigSchemaType
    }
}
