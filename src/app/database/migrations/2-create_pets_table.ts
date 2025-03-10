import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    // Migration code
    const migration =   await db.schema
        .createTable('pets')
        .addColumn('id', 'serial', (col) => col.primaryKey())
        .addColumn('animal_type', 'varchar(50)', (col) => col.notNull())
        .addColumn('name', 'varchar(50)', (col) => col.notNull())
        .addColumn('nickname', 'varchar(50)')
        .addColumn('date_of_birth', 'date', (col) => col.notNull())
        .addColumn('created_at', 'timestamptz', (col) => col.defaultTo(sql`now()`))
        .addColumn('updated_at', 'timestamptz', (col) => col.defaultTo(sql`now()`))
        .compile();

    console.log({sql: migration.sql})
    await db.executeQuery(migration)

}

export async function down(db: Kysely<any>): Promise<void> {
    // Migration code
    const migration = db.schema.dropTable('pets').compile()
    console.log({sql: migration.sql})
    await db.executeQuery(migration)
}
