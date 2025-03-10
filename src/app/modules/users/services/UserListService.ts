import fp from "fastify-plugin";
import {UserListServiceInterface} from "../interfaces/UserListServiceInterface";

export default fp(
    async (fastify, opts) => {
        class UserListService implements UserListServiceInterface{
            async getUserList(){
                const UserRepository = fastify.getUserRepository();

                return await UserRepository.getUserList();
            }
        }

        fastify.decorate('UserListService', new UserListService())

    },{
        name: 'UserListService',
        dependencies: ['UserRepository']
    });


declare module 'fastify' {
    export interface FastifyInstance {
        UserListService: UserListServiceInterface
    }
}
