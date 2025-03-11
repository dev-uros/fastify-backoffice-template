import fp from "fastify-plugin";
import {AuthRefreshAccessTokenServiceInterface} from "../interfaces/AuthRefreshAccessTokenServiceInterface";

export default fp(async (fastify, opts) => {

    class AuthRefreshAccessTokenService implements AuthRefreshAccessTokenServiceInterface {

        async refreshAccessToken(refreshToken: string) {

            return fastify.refreshAccessToken(refreshToken)
        }
    }

    fastify.decorate('AuthRefreshAccessTokenService', new AuthRefreshAccessTokenService())

}, {
    name: 'AuthRefreshAccessTokenService',
    dependencies: ['database']
})


declare module 'fastify' {
    export interface FastifyInstance {
        AuthRefreshAccessTokenService: AuthRefreshAccessTokenServiceInterface
    }
}