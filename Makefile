include ./.env.docker

#Builds the container
up:
	docker compose -f $(DOCKER_COMPOSE_FILE) --env-file .env.docker up --build

up-detached:
	docker compose -f $(DOCKER_COMPOSE_FILE) --env-file .env.docker up -d --build

down:
	docker compose -f $(DOCKER_COMPOSE_FILE) --env-file .env.docker down
	docker container prune
	docker image prune -a
env:
	$(MAKE) fix-env
	cat $(PWD)/.env.local >> $(PWD)/src/.env

fix-env:
	if [ -a $(PWD)/src/.env ]; \
		then rm -f $(PWD)/src/.env; \
	fi
	touch $(PWD)/src/.env

generate-database-types:
	docker exec -it $(WEBSERVER_CONTAINER_NAME) /bin/sh -c "npm run database:generate-types"

wait-for-db:
	docker exec -it $(DB_CONTAINER_NAME) /bin/sh -c 'until pg_isready -h localhost -p 5432; do echo waiting for db; sleep 2; done'

wait-for-node:
	@echo "Waiting for the node server to be up on localhost:3000..."
	@until curl --silent --fail http://localhost:3000/healthcheck > /dev/null; do \
		echo "Waiting for node server..."; \
		sleep 2; \
	done
	@echo "Node server is running on localhost:3000."

attach-to-logs:
	docker compose --env-file .env.docker logs -f
init:
	echo "Microservice Template Initializing"
	$(MAKE) env
	$(MAKE) up-detached
	$(MAKE) wait-for-db
	$(MAKE) wait-for-node
	$(MAKE) generate-database-types
	$(MAKE) attach-to-logs

node:
	  docker exec -it $(WEBSERVER_CONTAINER_NAME) /bin/sh

#Makes a dump folder for database backup
dump:
	mkdir -p ./dump-scripts
#Makes a database backup
backup:
	docker exec -t $(DB_CONTAINER_NAME) pg_dump -c -U postgres $(DB_NAME) > ./dump-scripts/$(DB_DUMP_FILENAME)
#Restores a database from backup file
restore:
	cat ./dump-scripts/$(DB_DUMP_FILENAME) | docker exec -i $(DB_CONTAINER_NAME) psql -U postgres es -d $(DB_NAME)