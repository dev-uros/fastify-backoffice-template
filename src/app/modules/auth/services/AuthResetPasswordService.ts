import fp from "fastify-plugin";
import {AuthResetPasswordServiceInterface} from "../interfaces/AuthResetPasswordServiceInterface";

export default fp(async (fastify, opts) => {
    class AuthResetPasswordService implements AuthResetPasswordServiceInterface {
        async resetPassword(email: string, password: string, passwordResetId: number) {

            await fastify.db.transaction().execute(async (transaction) => {
                const UserRepository = fastify.getUserRepository(transaction);
                const PasswordResetRepository = fastify.getPasswordResetRepository(transaction);

                const hashedPassword = await fastify.hashPassword(password);

                //update user password
                await UserRepository.updateUserPassword(email, hashedPassword)

                //delete password reset request
                await PasswordResetRepository.delete(passwordResetId);

            });

        }
    }

    fastify.decorate('AuthResetPasswordService', new AuthResetPasswordService())
}, {
    name: 'AuthResetPasswordService',
    dependencies: ['database']
})

declare module 'fastify' {
    export interface FastifyInstance {
        AuthResetPasswordService: AuthResetPasswordServiceInterface
    }
}