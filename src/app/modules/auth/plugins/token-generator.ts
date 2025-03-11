import fp from "fastify-plugin";
import {randomUUID} from "crypto";

export default fp(
    async (fastify, opts) => {

        const generateRefreshAndAccessTokens = (userId: number) => {
            const sessionId = randomUUID();
            const currentTimestamp = new Date(); // Current time
            const validFrom = currentTimestamp.toISOString(); // Convert to ISO string for DB
            const validTo = new Date(currentTimestamp.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(); // Add 7 days in milliseconds
            const accessToken = fastify.jwt.sign(
                {session_id: sessionId, user_id: userId},
                {expiresIn: "15m"}
            );

            const refreshToken = fastify.jwt.sign(
                {session_id: sessionId, user_id: userId},
                {expiresIn: "7d"}
            );

            return {
                accessToken,
                refreshToken,
                sessionId,
                validFrom,
                validTo
            }
        }

        fastify.decorate('generateRefreshAndAccessTokens', generateRefreshAndAccessTokens)

    }
)

declare module 'fastify' {
    interface FastifyInstance {
        generateRefreshAndAccessTokens(userId: number): {accessToken: string, refreshToken: string, sessionId, validFrom: string, validTo: string},
    }

}