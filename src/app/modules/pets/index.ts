import {FastifyPluginAsync} from "fastify";
import {FastifyPluginOptions} from "fastify/types/plugin.js";
import {join} from "desm";
import AutoLoad from "@fastify/autoload";


const petDomain: FastifyPluginAsync = async (fastify, opts: FastifyPluginOptions)=> {

    await fastify.register(AutoLoad, {
        dir: join(import.meta.url, 'repositories'),
        forceESM: true,
    })

    await fastify.register(AutoLoad, {
        dir: join(import.meta.url, 'services'),
        forceESM: true,
    })

    await fastify.register(AutoLoad, {
        dir: join(import.meta.url, 'routes'),
        options: {
            prefix: opts.prefix,
        },
        indexPattern: /index\.(js|ts)$/,
        ignorePattern: /.*\.js/,
        autoHooks: true,
        autoHooksPattern: /autohooks\.(js|ts)$/,
        cascadeHooks: true,
        forceESM: true,
        encapsulate: true
    })
}

export default petDomain;