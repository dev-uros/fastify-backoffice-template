import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    // Migration code
    const migration = db.schema
        .createTable('password_resets')
        .addColumn('id', 'serial', col => col.primaryKey())
        .addColumn('token', 'varchar(255)', col => col.notNull())
        .addColumn('email', 'varchar(255)', col => col.notNull())
        .addColumn('created_at', 'timestamptz', col =>
            col.defaultTo(sql`now()`).notNull()
        )
        .addColumn('deleted_at', 'timestamptz', col =>
            col.defaultTo(null)
        )
        .compile()

    console.log({sql: migration.sql})
    await db.executeQuery(migration)

}

export async function down(db: Kysely<any>): Promise<void> {
    // Migration code
    const migration = db.schema.dropTable('password_resets').compile()
    console.log({sql: migration.sql})
    await db.executeQuery(migration)
}
