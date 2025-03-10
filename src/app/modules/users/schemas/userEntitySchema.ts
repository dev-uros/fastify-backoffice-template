import {Type} from '@sinclair/typebox'

export const UserEntitySchema = Type.Object({
    id: Type.Number(),
    first_name: Type.String(),
    last_name: Type.String(),
    is_active: Type.Boolean(),
    email: Type.String({format: 'email'}),
    created_at: Type.String(),
    updated_at: Type.String()
})

