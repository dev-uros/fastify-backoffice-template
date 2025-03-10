import fp from 'fastify-plugin'
import {Kysely, PostgresDialect} from "kysely";
import pg from 'pg'
import { DB } from 'kysely-codegen';
const {Pool} = pg;

export default fp(async (fastify, opts) => {

    const dialect = new PostgresDialect({
        pool: new Pool({
            database: fastify.config.DATABASE_NAME,
            host: fastify.config.DATABASE_HOST,
            user: fastify.config.DATABASE_USER,
            password: fastify.config.DATABASE_PASSWORD,
            port: Number(fastify.config.DATABASE_PORT),
            max: 10,
        }),
    })

    const db = new Kysely<DB>({
        dialect,
    })

    fastify.decorate('db', db);

}, {
    name: 'database',
    dependencies: ['config']
})

declare module 'fastify' {
    export interface FastifyInstance {
        db: Kysely<DB>
    }
}