import fp from 'fastify-plugin'
import {Insertable, Kysely, Selectable, sql, Transaction} from 'kysely'
import {DB, PasswordResets} from 'kysely-codegen'
import {PasswordResetRepositoryInterface} from "../interfaces/PasswordResetRepositoryInterface";

class PasswordResetRepository implements PasswordResetRepositoryInterface {
    private db

    constructor(db: Kysely<DB> | Transaction<DB>) {
        this.db = db
    }

    async find(id: number, email: string): Promise<Selectable<PasswordResets> | undefined> {
        return await this.db
            .selectFrom('password_resets')
            .where('password_resets.id', '=', id)
            .where('password_resets.email', '=', email)
            .where('deleted_at', 'is', null)
            .selectAll()
            .executeTakeFirst()
    }

    async store(data: Insertable<PasswordResets>): Promise<Selectable<PasswordResets>> {
        return await this.db
            .insertInto('password_resets')
            .values(data)
            .returningAll()
            .executeTakeFirstOrThrow()
    }

    async delete(id: number): Promise<Selectable<PasswordResets> | undefined> {
        return await this.db
            .updateTable('password_resets')
            .where('password_resets.id', '=', id)
            .set({deleted_at: sql`now()`})
            .returningAll()
            .executeTakeFirst()
    }

}

export default fp(
    async (fastify, opts) => {

        fastify.decorate('getPasswordResetRepository', (dbInstance: Kysely<DB> | Transaction<DB> = fastify.db) => {
            return new PasswordResetRepository(dbInstance);
        });
    },
    {
        name: 'PasswordResetRepository',
        dependencies: ['database']
    }
)

declare module 'fastify' {
    export interface FastifyInstance {
        getPasswordResetRepository: (dbInstance?: Kysely<DB> | Transaction<DB>) => PasswordResetRepositoryInterface
    }
}
