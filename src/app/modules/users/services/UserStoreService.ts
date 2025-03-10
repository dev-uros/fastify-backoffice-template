import fp from "fastify-plugin";

import {UserStoreServiceInterface} from "../interfaces/UserStoreServiceInterface";
import {UserStoreRequestSchemaType} from "../schemas/storeSchema";

export default fp(
    async (fastify, opts) => {
        class UserStoreService implements UserStoreServiceInterface {
            async store(userData: UserStoreRequestSchemaType) {

                return await fastify.db.transaction().execute(async (transaction)=> {
                    const UserRepository = fastify.getUserRepository(transaction);
                    const PasswordResetRepository = fastify.getPasswordResetRepository(transaction);

                    const passwordObject = await fastify.generatePasswordObject();

                    const user = await UserRepository.store({
                        ...userData,
                        password: passwordObject.hashedPassword
                    });

                    const urlTokenObject = await fastify.generatePasswordObject();

                    const passwordResetRequest = await PasswordResetRepository.store({email: user.email, token: urlTokenObject.hashedPassword})

                    await fastify.sendActivateAccountEmailToUser(user, urlTokenObject.plainTextPassword, passwordResetRequest.id);

                    return user;
                })


            }
        }

        fastify.decorate('UserStoreService', new UserStoreService())

    }, {
        name: 'UserStoreService',
        dependencies: ['UserRepository', 'passwordUtils', 'userAccountActivationEmailQueue']
    });


declare module 'fastify' {
    export interface FastifyInstance {
        UserStoreService: UserStoreServiceInterface
    }
}
