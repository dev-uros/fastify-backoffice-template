import fp from "fastify-plugin";

import { UserListServiceInterface } from "../interfaces/UserListServiceInterface";
import { UserRepositoryInterface } from "../interfaces/UserRepositoryInterface";


export class UserListService implements UserListServiceInterface{

    constructor(private userRepository: UserRepositoryInterface){
        this.userRepository = userRepository;
    }

    async getUserList(){

        return await this.userRepository.getUserList();
    }
}

export default fp(
    async (fastify, opts) => {

        fastify.decorate('getUserListService', (userRepository: UserRepositoryInterface)=>{
            return new UserListService(userRepository)
        })

    },{
        name: 'getUserListService',
    });


declare module 'fastify' {
    export interface FastifyInstance {
        getUserListService(userRepository: UserRepositoryInterface): UserListServiceInterface
    }
}