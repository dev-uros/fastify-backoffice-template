import fp from "fastify-plugin";
import {AuthForgotPasswordServiceInterface} from "../interfaces/AuthForgotPasswordServiceInterface";

export default fp(async (fastify, opts) => {
    class AuthForgotPasswordService implements AuthForgotPasswordServiceInterface {
        async generateForgotPasswordRequest(email: string) {

            await fastify.db.transaction().execute(async (transaction) => {
                const UserRepository = fastify.getUserRepository(transaction);

                const PasswordResetRepository = fastify.getPasswordResetRepository(transaction);

                const user = await UserRepository.findByEmail(email);

                const urlTokenObject = await fastify.generatePasswordObject();

                const passwordResetRequest = await PasswordResetRepository.store({email: user.email, token: urlTokenObject.hashedPassword})

                await fastify.sendUserForgotPasswordEmailToUser(user, urlTokenObject.plainTextPassword, passwordResetRequest.id);

            });

        }
    }

    fastify.decorate('AuthForgotPasswordService', new AuthForgotPasswordService())
}, {
    name: 'AuthForgotPasswordService',
    dependencies: ['database']
})

declare module 'fastify' {
    export interface FastifyInstance {
        AuthForgotPasswordService: AuthForgotPasswordServiceInterface
    }
}