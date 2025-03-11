import {Static, Type} from "@sinclair/typebox";

export const loginRequestSchema = Type.Object(
    {

        email: Type.String({
            minLength: 1,
            maxLength: 255,
            format: 'email',
            errorMessage: {
                minLength: 'User email should have at least one character!',
                maxLength: 'User email can have up to 255 characters!',
                format: 'Invalid user email format'
            },
            transform: ['trim']
        }),
        password: Type.String({
            minLength: 1,
            maxLength: 255,
            errorMessage: {
                minLength: 'User password should have at least one character!',
                maxLength: 'User password can have up to 255 characters!',
            },
            transform: ['trim']
        })


    },
    {
        errorMessage: {
            type: 'Invalid JSON',
            required: {
                email: 'User email is required',
                password: 'User password is required'
            },
        },
        additionalProperties: false
    }
)

export type LoginRequestSchemaType = Static<typeof loginRequestSchema>


export const loginResponseSchema = Type.Object(
    {
        message: Type.String(),
        accessToken: Type.String()
    },
    {
        description: 'Success response',
        additionalProperties: false
    }
)
export type LoginResponseSchemaType = Static<typeof loginResponseSchema>