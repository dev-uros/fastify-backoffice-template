import fp from "fastify-plugin";
import {LoginRequestSchemaType} from "../schemas/generateTokenSchema";
import {AuthLoginServiceInterface} from "../interfaces/AuthLoginServiceInterface";

export default fp(async (fastify, opts) => {

    class AuthLoginService implements AuthLoginServiceInterface {

        async login(loginData: LoginRequestSchemaType, ip: string, userAgent: string) {

            return await fastify.db.transaction().execute(async (transaction) => {
                const UserRepository = fastify.getUserRepository(transaction);
                const UserSessionRepository = fastify.getUserSessionRepository(transaction);

                const user = await UserRepository.findActiveByEmail(loginData.email);

                const {
                    accessToken,
                    refreshToken,
                    sessionId,
                    validFrom,
                    validTo
                } = fastify.generateRefreshAndAccessTokens(user.id);

                const userSessionData = {
                    session_id: sessionId,
                    user_id: user.id,
                    user_agent: userAgent,
                    ip_address: ip,
                    valid_from: validFrom,
                    valid_to: validTo
                };

                await UserSessionRepository.store(userSessionData);

                return {
                    accessToken,
                    refreshToken,
                }
            })

        }
    }

    fastify.decorate('AuthLoginService', new AuthLoginService())

}, {
    name: 'AuthLoginService',
    dependencies: ['database']
})


declare module 'fastify' {
    export interface FastifyInstance {
        AuthLoginService: AuthLoginServiceInterface
    }
}