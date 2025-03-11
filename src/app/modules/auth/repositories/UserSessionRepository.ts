import fp from 'fastify-plugin'
import {Insertable, Kysely, Selectable, sql, Transaction} from 'kysely'
import {DB, PasswordResets, UserSessions} from 'kysely-codegen'
import {UserSessionRepositoryInterface} from "../interfaces/UserSessionRepositoryInterface";

class UserSessionRepository implements UserSessionRepositoryInterface {
    private db

    constructor(db: Kysely<DB> | Transaction<DB>) {
        this.db = db
    }

    async store(data: Insertable<UserSessions>): Promise<Selectable<UserSessions>> {
        return await this.db
            .insertInto('user_sessions')
            .values(data)
            .returningAll()
            .executeTakeFirstOrThrow()
    }

}

export default fp(
    async (fastify, opts) => {

        fastify.decorate('getUserSessionRepository', (dbInstance: Kysely<DB> | Transaction<DB> = fastify.db) => {
            return new UserSessionRepository(dbInstance);
        });
    },
    {
        name: 'UserSessionRepository',
        dependencies: ['database']
    }
)

declare module 'fastify' {
    export interface FastifyInstance {
        getUserSessionRepository: (dbInstance?: Kysely<DB> | Transaction<DB>) => UserSessionRepositoryInterface
    }
}
