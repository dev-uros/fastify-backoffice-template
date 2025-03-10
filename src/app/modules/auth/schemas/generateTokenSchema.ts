import {Static, Type} from "@sinclair/typebox";

export const generateTokenRequestSchema = Type.Object(
    {

        name: Type.String({
            minLength: 1,
            maxLength: 50,
            errorMessage: {
                minLength: 'User name should have at least one character!',
                maxLength: 'User name can have up to 255 characters!'
            },
            transform: ['trim']
        }),

    },
    {
        errorMessage: {
            type: 'Invalid JSON',
            required: {
                name: 'User name is required',
            },
        },
        additionalProperties: false
    }
)

export type GenerateTokenRequestSchemaType = Static<typeof generateTokenRequestSchema>


export const generateTokenResponseSchema = Type.Object(
    {
        message: Type.String(),
        data: Type.String()
    },
    {
        description: 'Success response',
        additionalProperties: false
    }
)
export type GenerateTokenResponseSchemaType = Static<typeof generateTokenResponseSchema>