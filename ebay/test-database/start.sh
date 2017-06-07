#!/bin/sh

# Run the MySQL container, with a database named 'users' and credentials
# for a users-service user which can access it.
echo "Starting DB..."
docker run --name db -d \
  -e MYSQL_ROOT_PASSWORD=123 \
  -e MYSQL_DATABASE=test -e MYSQL_USER=user_service -e MYSQL_PASSWORD=123 \
  -p 3306:3306 \
  mysql:latest

# Wait for the database service to start up.
echo "Waiting for DB to start up..."
docker exec db mysqladmin --silent --wait=30 -uuser_service -pMayank21 ping || exit 1

# Run the setup script.
echo "Setting up initial data..."
docker exec -i db mysql -uuser_service -pMayank21 test < setup.sql
