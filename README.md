

# PROJECT SETUP

## Requirements

- Installed `Docker`
- [Get Docker](https://www.docker.com/)
- Installed `GNU Make`
- [Get GNU Make](https://formulae.brew.sh/formula/make#default)


### Project initialization

1. Run the following command: `make init`
- Running `make init` does the following:
- `.env ` file will be generated inside of `src` directory (based on `.env.local` file in project root directory)
- `Docker` containers will be built (`webserver container`, `database container`)
- Npm install will be run inside of webserver container
- Initial database setup will be run based on init-scripts/init.sql file
- When both database and node servers are up and running, inside of webserver container following command will be run: npm run database:generate-types (executes kysely-codegen command to generate types based on tables created)

**Run this command only once!**

### Additional information

1. Command `make up` brings the docker containers up and running

2. Command `make down` shuts the docker containers down

3. Command `make node` enters the docker node webserver terminal (*use for server commands like npm install...*)

4. Command `make dump` creates the dump-scripts folder for database dump

5. Command `make backup` created database dump file inside of dump-scripts folder

6. Command `make restore` restores database from the dump located in dump-scripts folder

7. When making changes to .env file, you can make them inside of the .env.local and then run `make env` command. The command copies data from .env.local   to .env  file inside of the src directory. By default, .env.local file is not ignored by git tracking, so local environment variables can easily be shared amongst the collaborators.

**When finished with developing run make down!**
