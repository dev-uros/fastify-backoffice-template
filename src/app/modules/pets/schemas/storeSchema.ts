import {Static, Type} from "@sinclair/typebox";
import {PetEntitySchema} from "./petEntitySchema.js";

enum PetType {
    Dog = 'Dog',
    Cat = 'Cat',
    Parrot = 'Parrot',
    Rabbit = 'Rabbit',
    Turtle = 'Turtle',
    Hamster = 'Hamster'
}
export const petStoreRequestSchema = Type.Object(
    {
        animal_type: Type.Enum(PetType, {
            errorMessage: 'Animal type has to be either Dog, Cat, Parrot, Rabbit or Turtle'
        }),
        name: Type.String({
            minLength: 1,
            maxLength: 255,
            errorMessage: {
                minLength: 'Pet name should have at least one character!',
                maxLength: 'Pet name can have up to 255 characters!'
            },
            transform: ['trim']
        }),
        nickname: Type.String({
            minLength: 1,
            maxLength: 255,
            errorMessage: {
                minLength: 'User email should have at least one character!',
                maxLength: 'User email can have up to 255 characters!',
                format: 'Invalid user email format'
            },
            transform: ['trim']
        }),
        date_of_birth: Type.String({
            format: 'date',
            errorMessage: {
                format: 'Date of birth must be in format Y-m-d, example 2024-11-23'
            },
            transform: ['trim']

        }),
    },
    {
        errorMessage: {
            type: 'Invalid JSON',
            required: {
                animal_type: 'Pet type is required',
                name: 'Pet name is required',
                nickname: 'Pet nickname is required',
                date_of_birth: 'Pet date of birth is required'
            },
        },
        additionalProperties: false
    }
)

export type PetStoreRequestSchemaType = Static<typeof petStoreRequestSchema>


export const petStoreResponseSchema = Type.Object(
    {
        message: Type.String(),
        data: PetEntitySchema
    },
    {
        description: 'Success response',
        additionalProperties: false
    }
)
export type PetStoreResponseSchemaType = Static<typeof petStoreResponseSchema>