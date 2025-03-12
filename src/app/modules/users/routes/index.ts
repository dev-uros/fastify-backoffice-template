import {FastifyPluginAsync} from 'fastify'
import { indexResponseSchema } from '../schemas/indexSchema.js'
import { entityNotFoundResponseSchema } from '../../../schemas/entityNotFoundSchema.js'
import { badRequestResponseSchema } from '../../../schemas/badRequestSchema.js'
import { serverErrorResponseSchema } from '../../../schemas/serverErrorSchema.js'
import {unauthenticatedResponseSchema} from "../../../schemas/unauthenticatedRequestSchema.js";
import {userShowParamSchema, userShowResponseSchema} from "../schemas/showSchema";
import {
  userUpdateParamSchema,
  userUpdateRequestSchema,
  UserUpdateRequestSchemaType,
  userUpdateResponseSchema
} from "../schemas/updateSchema";
import {userStoreRequestSchema, UserStoreRequestSchemaType, userStoreResponseSchema} from "../schemas/storeSchema";
import {
  forgotPasswordRequestSchema,
  ForgotPasswordRequestSchemaType, forgotPasswordResponseSchema,
  ForgotPasswordResponseSchemaType
} from "../../auth/schemas/forgotPasswordSchema";

const userRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.route({
    url: '',
    method: 'GET',
    handler: async function (request, reply) {

      const users = await fastify.UserListService.getUserList()

      return reply.send({
        message: 'Successfully retrieved users',
        data: users
      })

    },
    schema: {
      tags: ['users'],
      summary: 'User List',
      description: 'Returns list of all users',
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
    preHandler: async (request, reply) => {
      const user = await fastify.UserShowService.find(request.params.id)
      if(!user){
        throw new fastify.NotFoundError('User not found')
      }
    },
    handler: async (request, reply) => {
      const user = await fastify.UserShowService.find(request.params.id)
      return reply.send({
        message: 'Successfully shown user',
        data: user
      })
    },
    schema: {
      tags: ['users'],
      summary: 'Show user',
      description: 'Show user details',
      consumes: ['application/json'],
      params: userShowParamSchema,
      response: {
        200: userShowResponseSchema,
        400: badRequestResponseSchema,
        401: unauthenticatedResponseSchema,
        404: entityNotFoundResponseSchema,
        500: serverErrorResponseSchema
      }
    }
  })

  fastify.route<{Params: {id: number}, Body: UserUpdateRequestSchemaType}>({
    method: 'PATCH',
    url: '/:id',
    preHandler: async (request, reply) => {
      const UserRepository = fastify.getUserRepository();
      const user = await UserRepository.find(request.params.id)
      if(!user){
        throw new fastify.NotFoundError('User not found')
      }

      const emailExists = await UserRepository.findByEmailIgnoringUserId(request.body.email, request.params.id);

      if(emailExists){
        throw new fastify.ValidationError('User email is already taken')
      }


    },
    handler: async(request, reply) => {
      const user = await fastify.UserUpdateService.update(request.body, request.params.id);

      return reply.send({
        message: 'Successfully updated user',
        data: user
      })
    },
    schema:{
      body: userUpdateRequestSchema,
      params: userUpdateParamSchema,
      tags: ['users'],
      summary: 'Update user',
      description: 'Update user data',
      consumes: ['application/json'],
      response: {
        200: userUpdateResponseSchema,
        400: badRequestResponseSchema,
        401: unauthenticatedResponseSchema,
        404: entityNotFoundResponseSchema,
        500: serverErrorResponseSchema
      }
    }
  })

  fastify.route<{Body: UserStoreRequestSchemaType}>({
    method: 'POST',
    url: '',
    preHandler: async (request, reply) => {
      const UserRepository = fastify.getUserRepository();
      const emailExists = await UserRepository.findByEmail(request.body.email);

      if(emailExists){
        throw new fastify.ValidationError('User email is already taken')
      }
    },
    handler: async (request, reply) => {
      const user = await fastify.UserStoreService.store(request.body)

      return reply.send({
        message: 'Successfully stored a user',
        data: user
      })
    },
    schema:{
      body: userStoreRequestSchema,
      tags: ['users'],
      summary: 'Store user',
      description: 'Store user data',
      consumes: ['application/json'],
      response: {
        200: userStoreResponseSchema,
        400: badRequestResponseSchema,
        401: unauthenticatedResponseSchema,
        500: serverErrorResponseSchema
      }
    }
  });

  fastify.route<{
    Reply: ForgotPasswordResponseSchemaType,
    Body: ForgotPasswordRequestSchemaType,
  }>({
    url: '/resend-activate-account-email',
    method: 'POST',
    preHandler: async (request, reply) => {
      const UserRepository = fastify.getUserRepository();

      const user = await UserRepository.findInactiveByEmail(request.body.email);
      if (!user) {
        throw new fastify.NotFoundError('User does not exist')
      }

    },
    handler: async (request, reply) => {

      await fastify.AuthResendActivateAccountEmailService.resendActivateAccountEmail(request.body.email);

      return reply.send({
        message: 'Successfully made forgot password request!',
      })
    },
    schema: {
      tags: ['users'],
      summary: 'Forgot password',
      description: 'Forgot password',
      body: forgotPasswordRequestSchema,
      response: {
        200: forgotPasswordResponseSchema,
        400: badRequestResponseSchema,
        401: unauthenticatedResponseSchema,
        404: entityNotFoundResponseSchema,
        500: serverErrorResponseSchema
      }
    }
  })

}
export default userRoutes
