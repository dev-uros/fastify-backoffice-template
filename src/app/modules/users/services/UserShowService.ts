import fp from "fastify-plugin";
import {UserShowServiceInterface} from "../interfaces/UserShowServiceInterface";

export default fp(
    async (fastify, opts) => {
        class UserShowService implements UserShowServiceInterface{
            async find(userId: number){
                const UserRepository = fastify.getUserRepository();

                return await UserRepository.find(userId);
            }
        }

        fastify.decorate('UserShowService', new UserShowService())

    },{
        name: 'UserShowService',
        dependencies: ['UserRepository']
    });


declare module 'fastify' {
    export interface FastifyInstance {
        UserShowService: UserShowServiceInterface
    }
}
