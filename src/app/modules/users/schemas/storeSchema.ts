import {Static, Type} from "@sinclair/typebox";
import {UserEntitySchema} from "./userEntitySchema";


export const userStoreRequestSchema = Type.Object(
    {
        first_name: Type.String({
            minLength: 1,
            maxLength: 64,
            errorMessage: {
                minLength: 'User first name should have at least one character!',
                maxLength: 'User first name can have up to 64 characters!'
            },
            transform: ['trim']
        }),
        last_name: Type.String({
            minLength: 1,
            maxLength: 64,
            errorMessage: {
                minLength: 'User last name should have at least one character!',
                maxLength: 'User last name can have up to 64 characters!'
            },
            transform: ['trim']
        }),
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
    },
    {
        errorMessage: {
            type: 'Invalid JSON',
            required: {
                first_name: 'User first name is required',
                last_name: 'User last name is required',
                email: 'User email is required',
            },
        },
        additionalProperties: false
    }
)

export type UserStoreRequestSchemaType = Static<typeof userStoreRequestSchema>


export const userStoreResponseSchema = Type.Object(
    {
        message: Type.String(),
        data: UserEntitySchema
    },
    {
        description: 'Success response',
        additionalProperties: false
    }
)
export type UserStoreResponseSchemaType = Static<typeof userStoreResponseSchema>