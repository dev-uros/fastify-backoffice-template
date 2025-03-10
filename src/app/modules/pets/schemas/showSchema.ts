import {Type} from "@sinclair/typebox";
import {PetEntitySchema} from "./petEntitySchema.js";

export const petShowParamSchema = Type.Object(
    {
        id: Type.Number({ errorMessage: 'Pet ID parameter is required' })
    },
    {
        errorMessage: {
            type: 'Invalid JSON',
            required: {
                id: 'Pet ID parameter is required'
            }
        },
        additionalProperties: false
    }
)

export const petShowResponseSchema = Type.Object(
    {
        message: Type.String(),
        data: PetEntitySchema
    },
    {
        additionalProperties: false
    }
)