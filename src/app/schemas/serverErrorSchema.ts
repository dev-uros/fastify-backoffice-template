import { Static, Type } from '@sinclair/typebox'

export const serverErrorResponseSchema = Type.Object(
  {
    message: Type.String()
  },
  {
    additionalProperties: false
  }
)

export type ServerErrorResponseSchemaType = Static<
  typeof serverErrorResponseSchema
>
