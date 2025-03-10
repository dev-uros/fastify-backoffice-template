import {Static, Type} from "@sinclair/typebox";

export const forgotPasswordRequestSchema = Type.Object(
    {
        email: Type.String({
            format: 'email', transform: ['trim'],
            errorMessage: {
                format: 'Invalid user email format',
            }
        }),
    },
    {
        additionalProperties: false,
        errorMessage: {
            type: 'Invalid JSON',
            required: {
                email: 'Email is required',
            }
        },
    }
)

export type ForgotPasswordRequestSchemaType = Static<
    typeof forgotPasswordRequestSchema
>


export const forgotPasswordResponseSchema = Type.Object(
    {
        message: Type.String(),
    },
    {
        additionalProperties: false
    }
)

export type ForgotPasswordResponseSchemaType = Static<
    typeof forgotPasswordResponseSchema
>