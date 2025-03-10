import {Static, Type} from '@sinclair/typebox'

export const accountActivationResponseSchema = Type.Object(
    {
        message: Type.String(),
    },
    {
        additionalProperties: false
    }
)

export type AccountActivationResponseSchemaType = Static<
    typeof accountActivationResponseSchema
>


export const activateAccountParamSchema = Type.Object(
    {
        id: Type.Number({ errorMessage: 'Activate account request ID parameter is required' })
    },
    {
        errorMessage: {
            type: 'Invalid JSON',
            required: {
                id: 'Activate account request ID parameter is required'
            }
        },
        additionalProperties: false
    }
)

export const accountActivationRequestSchema = Type.Object(
    {
        email: Type.String({
            format: 'email', transform: ['trim'],
            errorMessage: {
                format: 'Invalid user email format',
            }
        }),
        token: Type.String({transform: ['trim']}),
        password: Type.String({
            pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+])[A-Za-z\\d!@#$%^&*()_+]{8,}$",
            transform: ['trim'],
            errorMessage: {
                pattern: 'Password must contain at least one upper case character,' +
                    ' lower case character, symbol (!@#$%^&*()_+), numeric value, and must have minimum length of 8 characters',
            }
        }),
        password_confirmation: Type.String({transform: ['trim']})
    },
    {
        additionalProperties: false,
        errorMessage: {
            type: 'Invalid JSON',
            required: {
                password: 'Password is required',
                password_confirmation: 'Password confirmation is required',
                email: 'Email is required',
                token: 'Token is required',
            }
        },
    }
)

export type AccountActivationRequestSchemaType = Static<
    typeof accountActivationRequestSchema
>