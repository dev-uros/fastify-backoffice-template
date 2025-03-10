import fp from "fastify-plugin";
import {UserUpdateServiceInterface} from "../interfaces/UserUpdateServiceInterface";
import {Updateable} from "kysely";
import {Users} from "kysely-codegen";

export default fp(
    async (fastify, opts) => {
        class UserUpdateService implements UserUpdateServiceInterface{
            async update(userData: Updateable<Users>,userId: number){
                const UserRepository = fastify.getUserRepository();

                return await UserRepository.update(userData, userId);
            }
        }

        fastify.decorate('UserUpdateService', new UserUpdateService())

    },{
        name: 'UserUpdateService',
        dependencies: ['UserRepository']
    });


declare module 'fastify' {
    export interface FastifyInstance {
        UserUpdateService: UserUpdateServiceInterface
    }
}
