import fp from "fastify-plugin";
import {AuthActivateAccountServiceInterface} from "../interfaces/AuthActivateAccountServiceInterface";

export default fp(async (fastify, opts) => {
    class AuthActivateAccountService implements AuthActivateAccountServiceInterface {
        async activateAccount(email: string, password: string, passwordResetId: number) {

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

    fastify.decorate('AuthActivateAccountService', new AuthActivateAccountService())
}, {
    name: 'AuthActivateAccountService',
    dependencies: ['database']
})

declare module 'fastify' {
    export interface FastifyInstance {
        AuthActivateAccountService: AuthActivateAccountServiceInterface
    }
}