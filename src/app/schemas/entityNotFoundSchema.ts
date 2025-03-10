import {Static, Type} from "@sinclair/typebox";

export const entityNotFoundResponseSchema = Type.Object(
    {
        message: Type.String()
    },
    {
        additionalProperties: false,
    }
)

export type EntityNotFoundResponseSchemaType = Static<
    typeof entityNotFoundResponseSchema
>
