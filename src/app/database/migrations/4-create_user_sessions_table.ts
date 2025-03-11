import {Kysely, sql} from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    // Migration code
    const migration = db.schema
        .createTable('user_sessions')
        .addColumn('id', 'serial', col => col.primaryKey())
        .addColumn('session_id', 'varchar(255)', col => col.notNull())
        .addColumn('user_id', 'integer', col => col.notNull())
        .addColumn('user_agent', 'varchar(255)')
        .addColumn('ip_address', 'varchar(255)')
        .addColumn('valid_from', 'timestamptz', col => col.notNull())
        .addColumn('valid_to', 'timestamptz', col => col.notNull())
        .compile();


    const addForeignKeyConstraint = db.schema
        .alterTable('user_sessions')
        .addForeignKeyConstraint('user_sessions_user_id_fkey', ['user_id'], 'users', ['id'], (cb) =>
            cb.onDelete('cascade').onUpdate('cascade')
        )
        .compile();

    const addIndex = db.schema
        .createIndex('user_sessions_user_id_index')
        .on('user_sessions')
        .column('user_id')
        .compile()


    console.log({sql: migration.sql})
    console.log({foreignKey: addForeignKeyConstraint.sql});
    console.log({index:addIndex.sql });

    await db.executeQuery(migration)
    await db.executeQuery(addForeignKeyConstraint)
    await db.executeQuery(addIndex)

}

export async function down(db: Kysely<any>): Promise<void> {
    // Migration code
    const migration = db.schema.dropTable('user_sessions').compile()
    console.log({sql: migration.sql})
    await db.executeQuery(migration)
}
