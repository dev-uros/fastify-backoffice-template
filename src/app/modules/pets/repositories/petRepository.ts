import fp from 'fastify-plugin'
import { Insertable, Kysely, Selectable, Updateable } from 'kysely'
import { DB, Pets } from 'kysely-codegen'
import { PetRepositoryInterface } from '../interfaces/petRepositoryInterface.js'

export default fp(
  async (fastify, opts) => {
    class PetRepository implements PetRepositoryInterface {
      private db

      constructor(db: Kysely<DB>) {
        this.db = db
      }

      async index(): Promise<Selectable<Pets>[]> {
        return await this.db
          .selectFrom('pets')
          .selectAll()
          .orderBy('id desc')
          .execute()
      }

      async find(petId: number): Promise<Selectable<Pets> | undefined> {
        return await this.db
          .selectFrom('pets')
          .where('pets.id', '=', petId)
          .selectAll()
          .executeTakeFirst()
      }

      async store(petData: Insertable<Pets>): Promise<Selectable<Pets>> {
        return await this.db
          .insertInto('pets')
          .values(petData)
          .returningAll()
          .executeTakeFirstOrThrow()
      }

      async update(
        petData: Updateable<Pets>,
        petId: number
      ): Promise<Selectable<Pets> | undefined> {
        return await this.db
          .updateTable('pets')
          .where('pets.id', '=', petId)
          .set(petData)
          .returningAll()
          .executeTakeFirst()
      }
    }

    await fastify.decorate('petRepository', new PetRepository(fastify.db))
  },
  {
    name: 'petRepository',
    dependencies: ['database']
  }
)

declare module 'fastify' {
  export interface FastifyInstance {
    petRepository: PetRepositoryInterface
  }
}
