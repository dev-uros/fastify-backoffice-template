import {Static, Type} from "@sinclair/typebox";


export const refreshAccessTokenResponseSchema = Type.Object(
    {
        message: Type.String(),
        accessToken: Type.String()
    },
    {
        description: 'Success response',
        additionalProperties: false
    }
)
export type RefreshAccessTokenResponseSchema = Static<typeof refreshAccessTokenResponseSchema>