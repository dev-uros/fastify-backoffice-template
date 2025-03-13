import fp from 'fastify-plugin'
import Swagger from '@fastify/swagger'
import SwaggerUI from '@fastify/swagger-ui'

export default fp(async (fastify, opts) => {
    fastify.register(Swagger, {
        openapi: {
            info: {
                title: 'Cool App Documentation',
                description: 'Testing the Fastify swagger API',
                version: '1.0.0'
            },

            components: {

                securitySchemes: {
                    BearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                    }
                },
            },
            security: [{BearerAuth: []}],

            tags: [
                {name: 'users', description: 'Users Module Endpoints'},
                {name: 'auth', description: 'Authentication module'}
            ]
        }
    })
    fastify.register(SwaggerUI, {
        routePrefix: '/documentation'
    })
})
