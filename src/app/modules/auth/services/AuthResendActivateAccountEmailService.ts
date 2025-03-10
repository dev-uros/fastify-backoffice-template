import fp from "fastify-plugin";
import {
    AuthResendActivateAccountEmailServiceInterface
} from "../interfaces/AuthResendActivateAccountEmailServiceInterface";


export default fp(
    async (fastify, opts) => {
        class AuthResendActivateAccountEmailService implements AuthResendActivateAccountEmailServiceInterface {
            async resendActivateAccountEmail(email: string) {

                return await fastify.db.transaction().execute(async (transaction)=> {
                    const UserRepository = fastify.getUserRepository(transaction);
                    const PasswordResetRepository = fastify.getPasswordResetRepository(transaction);

                    const user = await UserRepository.findInactiveByEmail(email);

                    const urlTokenObject = await fastify.generatePasswordObject();

                    const passwordResetRequest = await PasswordResetRepository.store({email: user.email, token: urlTokenObject.hashedPassword})

                    await fastify.sendActivateAccountEmailToUser(user, urlTokenObject.plainTextPassword, passwordResetRequest.id);

                })


            }
        }

        fastify.decorate('AuthResendActivateAccountEmailService', new AuthResendActivateAccountEmailService())

    }, {
        name: 'AuthResendActivateAccountEmailService',
    });


declare module 'fastify' {
    export interface FastifyInstance {
        AuthResendActivateAccountEmailService: AuthResendActivateAccountEmailServiceInterface
    }
}
