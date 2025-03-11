import {FastifyError, FastifyPluginAsync} from "fastify";
import {
    generateTokenRequestSchema,
    GenerateTokenRequestSchemaType,
    generateTokenResponseSchema, loginRequestSchema, LoginRequestSchemaType, loginResponseSchema
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
    // fastify.route({
    //     method: 'POST',
    //     url: '/refresh-token',
    //     preHandler: async (request, reply) => {
    //         if (!refreshToken) throw new Error("No refresh token");
    //     },
    //     handler: async (request, reply) => {
    //
    //
    //         const refreshToken = request.cookies.refresh_token;
    //
    //         console.log(refreshToken);
    //
    //         const decoded = fastify.jwt.verify(refreshToken);
    //
    //         console.log(decoded);
    //
    //         const newAccessToken = fastify.jwt.sign(
    //             {id: decoded.id},
    //             {expiresIn: "15m"}
    //         );
    //
    //         return reply.send({
    //             message: 'Successfully authenticated',
    //             data: newAccessToken
    //         });
    //
    //     },
    //     schema: {
    //         body: generateTokenRequestSchema,
    //         tags: ['auth'],
    //         summary: 'Auth - generate JWT token',
    //         description: 'Generates token for user',
    //         consumes: ['application/json'],
    //         response: {
    //             200: generateTokenResponseSchema,
    //             400: badRequestResponseSchema,
    //             404: entityNotFoundResponseSchema,
    //             500: serverErrorResponseSchema
    //         }
    //     }
    // })


    fastify.route<{ Body: LoginRequestSchemaType }>({
        method: 'POST',
        url: '/login',
        preHandler: async (request, reply) => {
            const UserRepository = fastify.getUserRepository();

            const user = await UserRepository.findActiveByEmail(request.body.email);

            if(!user){
                throw new fastify.NotFoundError('User not found')
            }

            const passwordVerified = await fastify.verifyPassword(request.body.password, user.password)

            if(!passwordVerified){
                throw new fastify.ValidationError('Password miss match')
            }

        },
        handler: async (request, reply) => {

            const {refreshToken, accessToken} = await fastify.AuthLoginService.login(
                request.body,
                request.ip,
                request.headers['user-agent']
            )

            reply.setCookie("refresh_token", refreshToken, {
                httpOnly: true,
                secure: fastify.config.APP_ENV === "production",
                sameSite: "Lax",
                path: "/auth/refresh-token",
            });


            return reply.send({
                message: 'Successfully authenticated',
                accessToken: accessToken
            });

        },
        schema: {
            body: loginRequestSchema,
            tags: ['auth'],
            summary: 'Auth - generate JWT token',
            description: 'Generates token for user',
            consumes: ['application/json'],
            response: {
                200: loginResponseSchema,
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

            if (request.body.password !== request.body.password_confirmation) {
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

            if (request.body.password !== request.body.password_confirmation) {
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
