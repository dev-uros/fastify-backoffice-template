import fp from "fastify-plugin";
import {PetStoreServiceInterface} from "../interfaces/petStoreServiceInterface.js";
import {PetStoreRequestSchemaType} from "../schemas/storeSchema.js";

export default fp(
    async (fastify, opts) => {
        class petStoreService implements PetStoreServiceInterface{
            async store(data: PetStoreRequestSchemaType){
                return await fastify.petRepository.store(data);
            }
        }

        fastify.decorate('petStoreService', new petStoreService())

    },{
        name: 'petStoreService',
        dependencies: ['petRepository']
    });


declare module 'fastify' {
    export interface FastifyInstance {
        petStoreService: PetStoreServiceInterface
    }
}
