.PHONY: setup start stop restart logs db-shell clean

# Project Variables
DOCKER_COMPOSE = docker-compose
BACKEND_CONTAINER = backend_app
POSTGRES_CONTAINER = postgres_db

# Set up the development environment
setup:
	@echo "Setting up the development environment..."
	@docker-compose up --build -d
	@echo "Environment setup complete!"

# Start the development environment
start:
	@echo "Starting the development environment..."
	@docker-compose up -d
	@echo "Environment started!"

# Stop all services
stop:
	@echo "Stopping all services..."
	@docker-compose down
	@echo "All services stopped."
restart:
# Stop all services
	@echo "Stopping all services..."
	@docker-compose down
	@echo "All services stopped."
# Start the development environment
	@echo "Starting the development environment..."
	@docker-compose up -d
	@echo "Environment started!"
# Show logs of the backend service
logs:
	@echo "Fetching logs from backend..."
	@docker logs -f $(BACKEND_CONTAINER)

# Open a shell in the PostgreSQL container
db-shell:
	@echo "Opening PostgreSQL shell..."
	@docker exec -it $(POSTGRES_CONTAINER) psql -U postgres -d mydb

# Clean up all Docker containers and volumes
clean:
	@echo "Stopping and removing all containers and volumes..."
	@docker-compose down --volumes --remove-orphans
	@echo "Cleanup complete!"

