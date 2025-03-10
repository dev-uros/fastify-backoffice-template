import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    // Migration code
    const migration = db.schema
        .createTable('users')
        .addColumn('id', 'serial', col => col.primaryKey())
        .addColumn('first_name', 'varchar(64)', col => col.notNull())
        .addColumn('last_name', 'varchar(64)')
        .addColumn('password', 'varchar(255)', col => col.notNull())
        .addColumn('email', 'varchar(255)', col => col.notNull().unique())
        .addColumn('is_active', 'boolean', col => col.notNull().defaultTo(false))
        .addColumn('created_at', 'timestamptz', col =>
            col.defaultTo(sql`now()`).notNull()
        )
        .addColumn('updated_at', 'timestamptz', col =>
            col.defaultTo(sql`now()`).notNull()
        )
        .compile()

    console.log({sql: migration.sql})
    await db.executeQuery(migration)

}

export async function down(db: Kysely<any>): Promise<void> {
    // Migration code
    const migration = db.schema.dropTable('users').compile()
    console.log({sql: migration.sql})
    await db.executeQuery(migration)
}
