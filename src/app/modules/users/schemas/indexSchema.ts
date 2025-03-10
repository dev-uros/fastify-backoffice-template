import { Static, Type } from '@sinclair/typebox'
import {UserEntitySchema} from "./userEntitySchema";


export const indexResponseSchema = Type.Object(
    {
        message: Type.String(),
        data: Type.Array(UserEntitySchema)
    },
    {
        additionalProperties: false
    }
)

export type IndexResponseSchemaType = Static<
    typeof indexResponseSchema
>
