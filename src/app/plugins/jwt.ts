import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import {Selectable} from "kysely";
import {Users} from "kysely-codegen";
import {FastifyReply, FastifyRequest} from "fastify";

export default fp(
    async (fastify, opts) => {
        fastify.register(fastifyJwt, {
            secret: fastify.config.JWT_SECRET
        })

        fastify.decorate('authenticate',async (request: FastifyRequest, reply: FastifyReply)=>{
            try {
                await request.jwtVerify()
            } catch (err) {
                return reply.send(err)
            }
        })
    }, {
        name: 'jwt',
        dependencies: ['config']
    })


declare module "@fastify/jwt" {
    interface FastifyJWT {
        payload: { id: number, name: string } // payload type is used for signing and verifying
        user: Selectable<Users>
    }
}
declare module 'fastify' {
    interface FastifyInstance {
        authenticate(request: FastifyRequest, reply: FastifyReply): void
    }

}