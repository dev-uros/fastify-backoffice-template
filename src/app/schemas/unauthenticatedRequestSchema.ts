import {Static, Type} from "@sinclair/typebox";

export const unauthenticatedResponseSchema = Type.Object(
    {
        message: Type.String()
    },
    {
        additionalProperties: false,
    }
)

export type UnauthenticatedResponseSchemaType = Static<
    typeof unauthenticatedResponseSchema
>
