#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status
set -x  # Print commands and their arguments as they are executed


# Configuration
# REMOTE_USER="your_remote_user"      # Replace with your remote server username
# REMOTE_HOST="your_remote_host"      # Replace with your server's IP or hostname
# REMOTE_PORT="22"                    # Replace with your SSH port (default: 22)
DOCKER_IMAGE_NAME="portfolio:latest"
DOCKER_IMAGE_TAR="image.tar"

# Ensure required environment variables are set
if [ -z "$SSH_PRIVATE_KEY" ]; then
  echo "Error: SSH_PRIVATE_KEY is not set"
  exit 1
fi


# Step 1: Build the Docker image
echo "Building Docker image..."
docker build -t $DOCKER_IMAGE_NAME .

# Step 2: Log build time
BUILD_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
echo "Build Time: $BUILD_TIME"

# Step 3: Compress the Docker image
echo "Compressing Docker image..."
docker save -o $DOCKER_IMAGE_TAR $DOCKER_IMAGE_NAME


# Step 4: Set up SSH
echo "Setting up SSH..."
mkdir -p ~/.ssh
echo "$SSH_PRIVATE_KEY" > ~/.ssh/server
chmod 700 ~/.ssh/server
ssh-keyscan -p $REMOTE_PORT -H $REMOTE_HOST >> ~/.ssh/known_hosts



# Step 5: Copy the Docker image to the server
echo "Copying Docker image to the server..."
scp -i ~/.ssh/server -P $REMOTE_PORT $DOCKER_IMAGE_TAR $REMOTE_USER@$REMOTE_HOST:/home/bryan/

# Step 6: Deploy the Docker image on the server
echo "Deploying Docker image on the server..."
ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST << EOF
  docker load -i /home/bryan/$DOCKER_IMAGE_TAR
  
  docker stop portfolio || true
  docker rm portfolio || true

  docker run -d --name portfolio -p 80:80 $DOCKER_IMAGE_NAME

  rm /home/bryan/$DOCKER_IMAGE_TAR
EOF

# Cleanup
echo "Cleaning up local files..."
rm -f $DOCKER_IMAGE_TAR

echo "Deployment completed successfully!"
