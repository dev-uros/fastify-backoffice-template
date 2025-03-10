import Fastify from "fastify";
import AutoLoad from '@fastify/autoload'
import {join} from 'desm'
import ajvErrors from 'ajv-errors'
import ajvKeywords from 'ajv-keywords'
import {TypeBoxTypeProvider} from '@fastify/type-provider-typebox'
import "dotenv/config";



let logger
if (process.env.APP_ENV === "local") {
    logger = {
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true
            }
        },
    }
} else {
    logger = true
}


const app = Fastify({
    logger: logger,
    ajv: {
        customOptions: {
            allErrors: true
        },
        plugins: [
            [
                //@ts-ignore
                ajvErrors,
                {
                    keepErrors: false,
                    singleError: false
                }
            ],
            //@ts-ignore
            ajvKeywords,
        ]
    }
})

app.withTypeProvider<TypeBoxTypeProvider>()


await app.register(AutoLoad, {
    dir: join(import.meta.url, 'plugins'),
    forceESM: true,
    encapsulate: false
})

await app.register(AutoLoad, {
    dir: join(import.meta.url, 'modules'),
    encapsulate: false,
    forceESM: true,
    maxDepth: 1
})

app.route({
    method: 'GET',
    url: '/healthcheck',
    handler: async (request, reply) => {

        return reply.send({
            message: 'Server Up'
        })
    }
})
export default app
