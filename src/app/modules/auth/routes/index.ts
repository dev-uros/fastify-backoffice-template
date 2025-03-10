import {FastifyError, FastifyPluginAsync} from "fastify";
import {
    generateTokenRequestSchema,
    GenerateTokenRequestSchemaType,
    generateTokenResponseSchema
} from "../schemas/generateTokenSchema.js";
import {badRequestResponseSchema} from "../../../schemas/badRequestSchema.js";
import {serverErrorResponseSchema} from "../../../schemas/serverErrorSchema.js";
import {entityNotFoundResponseSchema} from "../../../schemas/entityNotFoundSchema.js";
import {
    accountActivationRequestSchema,
    AccountActivationRequestSchemaType, accountActivationResponseSchema,
    AccountActivationResponseSchemaType, activateAccountParamSchema
} from "../schemas/activateAccountSchema";
import {unauthenticatedResponseSchema} from "../../../schemas/unauthenticatedRequestSchema";
import {
    forgotPasswordRequestSchema,
    ForgotPasswordRequestSchemaType,
    forgotPasswordResponseSchema,
    ForgotPasswordResponseSchemaType
} from "../schemas/forgotPasswordSchema";

const authRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.route<{ Body: GenerateTokenRequestSchemaType }>({
        method: 'POST',
        url: '/generate-token',
        handler: async (request, reply) => {

            const user = await fastify.authRepository.find(request.body.name)

            if (!user) {
                const error = new Error() as FastifyError
                error.statusCode = 404
                error.message = 'User not found'
                throw error
            }


            // Generate access token (short-lived)
            const accessToken = fastify.jwt.sign(
                { id: user.id, name: user.first_name },
                { expiresIn: "15m" } // Access token valid for 15 minutes
            );

            // Generate refresh token (long-lived)
            const refreshToken = fastify.jwt.sign(
                { id: user.id },
                { expiresIn: "7d" } // Refresh token valid for 7 days
            );


            // const token = fastify.jwt.sign({
            //     id: user.id,
            //     name: user.first_name
            // })

            // Store refresh token in an HTTP-only cookie
            reply.setCookie("refresh_token", refreshToken, {
                httpOnly: true,
                secure: fastify.config.APP_ENV === "production", // Ensure HTTPS in production
                sameSite: "Lax",
                path: "/refresh",
            });

            return reply.send({
                message: 'Successfully authenticated',
                data: accessToken
            });

        },
        schema: {
            body: generateTokenRequestSchema,
            tags: ['auth'],
            summary: 'Auth - generate JWT token',
            description: 'Generates token for user',
            consumes: ['application/json'],
            response: {
                200: generateTokenResponseSchema,
                400: badRequestResponseSchema,
                404: entityNotFoundResponseSchema,
                500: serverErrorResponseSchema
            }
        }
    })

    fastify.route<{
        Reply: AccountActivationResponseSchemaType,
        Body: AccountActivationRequestSchemaType,
        Params: { id: number }
    }>({
        url: '/activate-account/:id',
        method: 'POST',
        preHandler: async (request, reply) => {
            const UserRepository = fastify.getUserRepository();

            const PasswordResetRepository = fastify.getPasswordResetRepository();

            if(request.body.password !== request.body.password_confirmation){
                throw new fastify.ValidationError('Password and password confirmation miss match')
            }


            const user = await UserRepository.findByEmail(request.body.email);
            if (!user) {
                throw new fastify.NotFoundError('User does not exist')
            }

            const userPasswordResetRequest = await PasswordResetRepository.find(request.params.id, request.body.email);

            if (!userPasswordResetRequest) {
                throw new fastify.NotFoundError('Password request does not exist!')
            }

            const accountActivationTokenCheck = await fastify.verifyPassword(request.body.token, userPasswordResetRequest.token)

            if (!accountActivationTokenCheck) {
                throw new fastify.ValidationError('Invalid password reset token')
            }

        },
        handler: async (request, reply) => {

            await fastify.AuthActivateAccountService.activateAccount(request.body.email, request.body.password, request.params.id);

            return reply.send({
                message: 'Successfully activated account, please login with your email and entered password!',
            })
        },
        schema: {
            tags: ['auth'],
            summary: 'Activate account',
            description: 'Activate account',
            body: accountActivationRequestSchema,
            params: activateAccountParamSchema,
            response: {
                200: accountActivationResponseSchema,
                400: badRequestResponseSchema,
                401: unauthenticatedResponseSchema,
                404: entityNotFoundResponseSchema,
                500: serverErrorResponseSchema
            }
        }
    })

    fastify.route<{
        Reply: ForgotPasswordResponseSchemaType,
        Body: ForgotPasswordRequestSchemaType,
    }>({
        url: '/forgot-password',
        method: 'POST',
        preHandler: async (request, reply) => {
            const UserRepository = fastify.getUserRepository();

            const user = await UserRepository.findActiveByEmail(request.body.email);
            if (!user) {
                throw new fastify.NotFoundError('User does not exist')
            }

        },
        handler: async (request, reply) => {

            await fastify.AuthForgotPasswordService.generateForgotPasswordRequest(request.body.email);

            return reply.send({
                message: 'Successfully made forgot password request!',
            })
        },
        schema: {
            tags: ['auth'],
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

    fastify.route<{
        Reply: AccountActivationResponseSchemaType,
        Body: AccountActivationRequestSchemaType,
        Params: { id: number }
    }>({
        url: '/reset-password/:id',
        method: 'POST',
        preHandler: async (request, reply) => {
            const UserRepository = fastify.getUserRepository();

            const PasswordResetRepository = fastify.getPasswordResetRepository();

            if(request.body.password !== request.body.password_confirmation){
                throw new fastify.ValidationError('Password and password confirmation miss match')
            }


            const user = await UserRepository.findActiveByEmail(request.body.email);
            if (!user) {
                throw new fastify.NotFoundError('User does not exist')
            }

            const userPasswordResetRequest = await PasswordResetRepository.find(request.params.id, request.body.email);

            if (!userPasswordResetRequest) {
                throw new fastify.NotFoundError('Password request does not exist!')
            }

            const accountActivationTokenCheck = await fastify.verifyPassword(request.body.token, userPasswordResetRequest.token)

            if (!accountActivationTokenCheck) {
                throw new fastify.ValidationError('Invalid password reset token')
            }

        },
        handler: async (request, reply) => {

            await fastify.AuthResetPasswordService.resetPassword(request.body.email, request.body.password, request.params.id);

            return reply.send({
                message: 'Successfully reset password',
            })
        },
        schema: {
            tags: ['auth'],
            summary: 'Activate account',
            description: 'Activate account',
            body: accountActivationRequestSchema,
            params: activateAccountParamSchema,
            response: {
                200: accountActivationResponseSchema,
                400: badRequestResponseSchema,
                401: unauthenticatedResponseSchema,
                404: entityNotFoundResponseSchema,
                500: serverErrorResponseSchema
            }
        }
    })

}

export default authRoutes
