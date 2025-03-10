import fp from 'fastify-plugin'
import { Kysely, Selectable } from 'kysely'
import {DB, Users} from 'kysely-codegen'
import {AuthRepositoryInterface} from "../interfaces/authRepositoryInterface.js";

export default fp(
    async (fastify, opts) => {
        class AuthRepository implements AuthRepositoryInterface {
            private db

            constructor(db: Kysely<DB>) {
                this.db = db
            }

            async find(name: string): Promise<Selectable<Users> | undefined> {
                return await this.db
                    .selectFrom('users')
                    .where('users.first_name', '=', name)
                    .selectAll()
                    .executeTakeFirst()
            }

        }

        await fastify.decorate('authRepository', new AuthRepository(fastify.db))
    },
    {
        name: 'authRepository',
        dependencies: ['database']
    }
)

declare module 'fastify' {
    export interface FastifyInstance {
        authRepository: AuthRepositoryInterface
    }
}
