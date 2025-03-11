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

        const refreshAccessToken = async(refreshToken: string) => {
            const decoded = await fastify.jwt.verify(refreshToken) as { session_id: string, user_id: number, iat: string, exp: string };

            return fastify.jwt.sign(
                {session_id: decoded.session_id, user_id: decoded.user_id},
                {expiresIn: "15m"}
            );
        }

        fastify.decorate('generateRefreshAndAccessTokens', generateRefreshAndAccessTokens)
        fastify.decorate('refreshAccessToken', refreshAccessToken)

    }
)

declare module 'fastify' {
    interface FastifyInstance {
        generateRefreshAndAccessTokens(userId: number): {accessToken: string, refreshToken: string, sessionId: string, validFrom: string, validTo: string},
        refreshAccessToken(refreshToken: string): Promise<string>,

    }

}