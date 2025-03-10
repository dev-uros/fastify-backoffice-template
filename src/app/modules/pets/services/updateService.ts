import fp from "fastify-plugin";
import {FastifyError} from "fastify";
import {PetUpdateRequestSchemaType} from "../schemas/updateSchema.js";
import {PetUpdateServiceInterface} from "../interfaces/petUpdateServiceInterface.js";

export default fp(
    async (fastify, opts) => {
        class petUpdateService implements PetUpdateServiceInterface{
            async update(data: PetUpdateRequestSchemaType, petId: number){
                const pet = await fastify.petRepository.update(data, petId);

                if(!pet){
                    const error = new Error() as FastifyError
                    error.statusCode = 404
                    error.message = 'Pet not found'
                    throw error
                }

                return pet;
            }
        }

        fastify.decorate('petUpdateService', new petUpdateService())

    },{
        name: 'petUpdateService',
        dependencies: ['petRepository']
    });


declare module 'fastify' {
    export interface FastifyInstance {
        petUpdateService: PetUpdateServiceInterface
    }
}
