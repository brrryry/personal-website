#!/bin/bash

# Exit script on any error
set -e

# Build the Docker image
echo "Building Docker image..."
docker build -t $DOCKER_USERNAME/$DOCKER_REPO:$IMAGE_TAG .

# Login to Docker Hub
echo "Logging into Docker Hub..."
echo "$DOCKER_TOKEN" | docker login --username $DOCKER_USERNAME --password-stdin


# Push the image to Docker Hub
echo "Pushing Docker image to Docker Hub..."
docker push $DOCKER_USERNAME/$DOCKER_REPO:$IMAGE_TAG

echo "done! :D"