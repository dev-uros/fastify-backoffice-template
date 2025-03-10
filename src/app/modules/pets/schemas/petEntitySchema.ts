import {Type} from '@sinclair/typebox'
// import {TDate} from "../../../types/customTypes";

export const PetEntitySchema = Type.Object({
    id: Type.Number(),
    animal_type: Type.String(),
    name: Type.String(),
    nickname: Type.String(),
    date_of_birth: Type.String({format: 'date'}),
    created_at: Type.String(),
    updated_at: Type.String()
})

