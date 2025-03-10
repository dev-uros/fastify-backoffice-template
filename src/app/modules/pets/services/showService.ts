import fp from "fastify-plugin";
import {PetShowServiceInterface} from "../interfaces/petShowServiceInterface.js";
import {FastifyError} from "fastify";

export default fp(
    async (fastify, opts) => {
        class petShowService implements PetShowServiceInterface{
            async find(petId: number){
                const pet = await fastify.petRepository.find(petId);

                if(!pet){
                    const error = new Error() as FastifyError
                    error.statusCode = 404
                    error.message = 'Pet not found'
                    throw error
                }

                return pet;
            }
        }

        fastify.decorate('petShowService', new petShowService())

    },{
        name: 'petShowService',
        dependencies: ['petRepository']
    });


declare module 'fastify' {
    export interface FastifyInstance {
        petShowService: PetShowServiceInterface
    }
}
