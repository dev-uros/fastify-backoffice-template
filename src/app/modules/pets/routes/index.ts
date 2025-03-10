import { FastifyPluginAsync } from 'fastify'
import { indexResponseSchema } from '../schemas/indexSchema.js'
import {
  petShowParamSchema,
  petShowResponseSchema
} from '../schemas/showSchema.js'
import { entityNotFoundResponseSchema } from '../../../schemas/entityNotFoundSchema.js'
import { badRequestResponseSchema } from '../../../schemas/badRequestSchema.js'
import { serverErrorResponseSchema } from '../../../schemas/serverErrorSchema.js'
import {petStoreRequestSchema, PetStoreRequestSchemaType, petStoreResponseSchema} from "../schemas/storeSchema.js";
import {
  petUpdateParamSchema,
  petUpdateRequestSchema,
  PetUpdateRequestSchemaType,
  petUpdateResponseSchema
} from "../schemas/updateSchema.js";
import {unauthenticatedResponseSchema} from "../../../schemas/unauthenticatedRequestSchema.js";

const petRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.route({
    url: '',
    method: 'GET',
    handler: async function (request, reply) {

      const pets = await fastify.petIndexService.getPets();
      return reply.send({
        message: 'Successfully retrieved pet lets',
        data: pets
      })

    },
    schema: {
      tags: ['pets'],
      summary: 'Pet List',
      description: 'Returns list of all pets',
      consumes: ['application/json'],
      response: {
        200: indexResponseSchema,
        401: unauthenticatedResponseSchema,
        500: serverErrorResponseSchema
      }
    }
  })

  fastify.route<{ Params: { id: number } }>({
    url: '/:id',
    method: 'GET',
    handler: async (request, reply) => {
      const pet = await fastify.petShowService.find(request.params.id)
      return reply.send({
        message: 'Successfully shown pet',
        data: pet
      })
    },
    schema: {
      tags: ['pets'],
      summary: 'Show pet',
      description: 'Show pet details',
      consumes: ['application/json'],
      params: petShowParamSchema,
      response: {
        200: petShowResponseSchema,
        400: badRequestResponseSchema,
        401: unauthenticatedResponseSchema,
        404: entityNotFoundResponseSchema,
        500: serverErrorResponseSchema
      }
    }
  })

  fastify.route<{Body: PetStoreRequestSchemaType}>({
    method: 'POST',
    url: '',
    handler: async (request, reply) => {
      const pet = await fastify.petStoreService.store(request.body)

      return reply.send({
        message: 'Successfully stored a pet',
        data: pet
      })
    },
    schema:{
      body: petStoreRequestSchema,
      tags: ['pets'],
      summary: 'Store pet',
      description: 'Store pet data',
      consumes: ['application/json'],
      response: {
        200: petStoreResponseSchema,
        400: badRequestResponseSchema,
        401: unauthenticatedResponseSchema,
        500: serverErrorResponseSchema
      }
    }
  });

  fastify.route<{Params: {id: number}, Body: PetUpdateRequestSchemaType}>({
    method: 'PATCH',
    url: '/:id',
    handler: async(request, reply) => {
      const pet = await fastify.petUpdateService.update(request.body, request.params.id);

      return reply.send({
        message: 'Successfully updated pet',
        data: pet
      })
    },
    schema:{
      body: petUpdateRequestSchema,
      params: petUpdateParamSchema,
      tags: ['pets'],
      summary: 'Update pet',
      description: 'Update pet data',
      consumes: ['application/json'],
      response: {
        200: petUpdateResponseSchema,
        400: badRequestResponseSchema,
        401: unauthenticatedResponseSchema,
        404: entityNotFoundResponseSchema,
        500: serverErrorResponseSchema
      }
    }
  })
}
export default petRoutes
