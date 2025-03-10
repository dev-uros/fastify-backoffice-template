import {Static, Type} from '@sinclair/typebox'

export const configSchema = Type.Object(
    {
        PORT: Type.Number({
            default: 3000,
            description: 'Application port'
        }),
        HOST: Type.String({
            default: '0.0.0.0',
            description: 'Application host'
        }),
        BASE_URL: Type.String({
            default: 'localhost:3000',
            description: 'Application environment'
        }),
        APP_ENV: Type.String({
            default: 'local',
            description: 'Application environment'
        }),
        DATABASE_NAME: Type.String({
            description: 'Application database name',
            default: 'microservice_template_db'
        }),
        DATABASE_HOST: Type.String({
            description: 'Application database host',
            default: 'db'
        }),
        DATABASE_PORT: Type.String({
            description: 'Application database port',
            default: '5432'
        }),
        DATABASE_USER: Type.String({
            description: 'Application database user',
            default: 'postgres'
        }),
        DATABASE_PASSWORD: Type.String({
            description: 'Application database password',
            default: 'postgres'
        }),
        DATABASE_URL: Type.String({
            description: 'Application database url',
            default: 'postgres://postgres:postgres@db:5432/microservice_template_db'
        }),
        JWT_SECRET: Type.String({
            description: 'Jwt token secret'
        }),
        MAIL_HOST: Type.String({
            description: 'E-mail service host',
            default: 'smtp.mailtrap.io'
        }),
        MAIL_PORT: Type.String({
            description: 'E-mail service port',
            default: '2525'
        }),
        MAIL_USERNAME: Type.String({
            description: 'E-mail service username',
            default: '3cd13f12cf55dd'
        }),
        MAIL_PASSWORD: Type.String({
            description: 'E-mail service password',
            default: '9f4e72b46bbaed'
        }),
        MAIL_ENCRYPTION: Type.String({
            description: 'E-mail service encryption',
            default: 'tls'
        }),
        MAIL_FROM_ADDRESS: Type.String({
            description: 'E-mail default from address',
            default: 'zakazivko@test.com'
        }),
        MAIL_FROM_NAME: Type.String({
            description: 'E-mail default from name',
            default: 'Zakazivko'
        }),
        REDIS_HOST: Type.String({
            description: 'Redis host',
            default: 'localhost'
        }),
        REDIS_PORT: Type.String({
            description: 'Redis host',
            default: '6379'
        }),
        REDIS_PASSWORD: Type.String({
            description: 'Redis host',
            default: 'redis'
        })
    },
    {
        additionalProperties: false
    }
)

export type ConfigSchemaType = Static<typeof configSchema>
