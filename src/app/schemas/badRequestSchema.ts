import {Static, Type} from "@sinclair/typebox";

const ErrorSchema = Type.Object({
    input: Type.String(),
    message: Type.String()
});
export const badRequestResponseSchema = Type.Object(
    {
        errors: Type.Array(ErrorSchema)
    },
    {
        additionalProperties: false,
    }
)

export type BadRequestResponseSchemaType = Static<
    typeof badRequestResponseSchema
>
