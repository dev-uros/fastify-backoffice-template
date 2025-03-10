import * as path from 'path'
import {promises as fs} from 'fs'
import {
    Migrator,
    FileMigrationProvider, NO_MIGRATIONS,
} from 'kysely'
import {join} from "desm";
import yargs from "yargs";
import app from "../app";

async function migrate() {

    const y = yargs();
    const argv = y
        .option('m', {
            alias: 'mode',
            describe: 'Migration mode (m for migrate, r for rollback, f for fresh)',
            choices: ['m', 'r', 'f']
        })
        .demandOption(['m'], 'Please provide the migration mode')
        .default('m', 'm') // Set the default value for 'mode' option to 'm'
        .check((argv) => {
            // Check if 'r' mode is selected and if 'name' parameter is provided
            if (argv.m === 'r' && typeof argv.name !== 'string') {
                throw new Error('Please provide the name parameter for rollback mode');
            }
            return true;
        })
        .option('n', {
            alias: 'name',
            describe: 'Name parameter for rollback mode',
            type: 'string',
            requiresArg: true,
            demandOption: false, // This parameter is not required by default
        })
        .parse(process.argv.slice(2)) as unknown as { file: string, table: string, mode: 'm' | 'r' | 'f', name?: string };


    const options = {
        mode: argv.mode,
        migrationName: argv.name
    };

    const db = app.db

    const migrator = new Migrator({
        db,
        provider: new FileMigrationProvider({
            fs,
            path,
            // This needs to be an absolute path.
            migrationFolder: join(import.meta.url, '../database/migrations'),
        }),
    })


    const {error, results} = await processMigrationMode(migrator, options.mode, options.migrationName)


    results?.forEach((it) => {
        if (it.status === 'Success') {
            console.log(`migration "${it.migrationName}" was executed successfully`)
        } else if (it.status === 'Error') {
            console.error(`failed to execute migration "${it.migrationName}"`)
        }
    })

    if (error) {
        console.error('failed to migrate')
        console.error(error)
        process.exit(1)
    }

    await db.destroy()
    console.log(`Finished running migrations!`)
    process.exit(0);
}

async function processMigrationMode(migrator: Migrator, migrationMode: 'm' | 'r' | 'f', migrationName?: string) {
    let error, results;
    switch (migrationMode) {
        case "f":
            ({ error, results } = await migrator.migrateTo(NO_MIGRATIONS));
            return { error, results };
        case "r":
            ({ error, results } = await migrator.migrateTo(migrationName!));
            return { error, results };
        default:
            ({ error, results } = await migrator.migrateToLatest());
            return { error, results };
    }

}

await migrate()