import fp from "fastify-plugin";
import fastifyView from "@fastify/view";
import ejs from 'ejs'
import {join} from "desm";


export default fp(async (fastify) => {
    fastify.register(fastifyView, {
        engine: {ejs: ejs},
        root: join(import.meta.url, '..', 'views'), // Points to `./views` relative to the current file
        production: fastify.config.APP_ENV === "production",
        defaultContext: {
            dev: fastify.config.APP_ENV === "local", // Inside your templates, `dev` will be `true` if the expression evaluates to true
        },
        charset: 'utf-8',
        // options: {}, // No options passed to handlebars
    })
}, {
    name: 'view',
    dependencies: ['config']
});