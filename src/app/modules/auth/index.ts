import {FastifyPluginAsync} from "fastify";
import {FastifyPluginOptions} from "fastify/types/plugin.js";

import {join} from "desm";
import AutoLoad from "@fastify/autoload";


const authDomain: FastifyPluginAsync = async (fastify, opts: FastifyPluginOptions)=> {

    await fastify.register(AutoLoad, {
        dir: join(import.meta.url, 'plugins'),
        forceESM: true,
        encapsulate: false
    })

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
        cascadeHooks: true,
        forceESM: true,
        encapsulate: true
    })
}

export default authDomain;