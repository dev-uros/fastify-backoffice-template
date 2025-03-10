import fp from "fastify-plugin";
import {PetIndexServiceInterface} from "../interfaces/petIndexServiceInterface.js";

export default fp(
    async (fastify, opts) => {
        class petIndexService implements PetIndexServiceInterface{
            async getPets(){
                console.log("udje u servis")
                return await fastify.petRepository.index();
            }
        }

        fastify.decorate('petIndexService', new petIndexService())

    },{
        name: 'petIndexService',
        dependencies: ['petRepository']
    });


declare module 'fastify' {
    export interface FastifyInstance {
        petIndexService: PetIndexServiceInterface
    }
}
