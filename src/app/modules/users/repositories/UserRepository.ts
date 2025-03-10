import fp from 'fastify-plugin'
import {Insertable, Kysely, Selectable, sql, Transaction, Updateable} from 'kysely'
import {DB, Users} from 'kysely-codegen'
import {UserRepositoryInterface} from "../interfaces/UserRepositoryInterface";


class UserRepository implements UserRepositoryInterface {
    private db: Kysely<DB> | Transaction<DB>

    constructor(db: Kysely<DB> | Transaction<DB>) {
        this.db = db
    }

    async getUserList(): Promise<Selectable<Users>[]> {
        return await this.db
            .selectFrom('users')
            .selectAll()
            .orderBy('id desc')
            .execute()
    }

    async find(userId: number): Promise<Selectable<Users> | undefined> {
        return await this.db
            .selectFrom('users')
            .where('users.id', '=', userId)
            .selectAll()
            .executeTakeFirst()
    }

    async update(
        userData: Updateable<Users>,
        userId: number
    ): Promise<Selectable<Users> | undefined> {
        return await this.db
            .updateTable('users')
            .where('users.id', '=', userId)
            .set(userData)
            .set('updated_at', sql`now()`)
            .returningAll()
            .executeTakeFirst()
    }

    async findByEmailIgnoringUserId(email: string, userId: number): Promise<Selectable<Users> | undefined> {
        return await this.db
            .selectFrom('users')
            .where('email', '=', email)
            .where('id', '!=', userId)
            .selectAll()
            .executeTakeFirst()
    }

    async findByEmail(email: string): Promise<Selectable<Users> | undefined> {
        return await this.db
            .selectFrom('users')
            .where('email', '=', email)
            .selectAll()
            .executeTakeFirst()
    }

    async findActiveByEmail(email: string): Promise<Selectable<Users> | undefined> {
        return await this.db
            .selectFrom('users')
            .where('email', '=', email)
            .where('is_active', '=', true)
            .selectAll()
            .executeTakeFirst()
    }

    async findInactiveByEmail(email: string): Promise<Selectable<Users> | undefined> {
        return await this.db
            .selectFrom('users')
            .where('email', '=', email)
            .where('is_active', '=', false)
            .selectAll()
            .executeTakeFirst()
    }

    async store(userData: Insertable<Users>): Promise<Selectable<Users>> {
        return await this.db
            .insertInto('users')
            .values(userData)
            .returningAll()
            .executeTakeFirstOrThrow()
    }

    async updateUserPassword(email: string, password: string): Promise<void> {
        await this.db
            .updateTable('users')
            .where('users.email', '=', email)
            .set({
                password,
                is_active: true
            })
            .execute()
    }


}

export default fp(
    async (fastify, opts) => {

        fastify.decorate('getUserRepository', (dbInstance: Kysely<DB> | Transaction<DB> = fastify.db) => {
            return new UserRepository(dbInstance);
        });
    },
    {
        name: 'UserRepository',
        dependencies: ['database']
    }
)

declare module 'fastify' {
    export interface FastifyInstance {
        getUserRepository: (dbInstance?: Kysely<DB> | Transaction<DB>) => UserRepositoryInterface
    }
}
