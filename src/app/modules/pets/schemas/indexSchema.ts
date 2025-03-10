import { Static, Type } from '@sinclair/typebox'
import {PetEntitySchema} from "./petEntitySchema.js";


export const indexResponseSchema = Type.Object(
    {
        message: Type.String(),
        data: Type.Array(PetEntitySchema)
    },
    {
        additionalProperties: false
    }
)

export type IndexResponseSchemaType = Static<
    typeof indexResponseSchema
>
