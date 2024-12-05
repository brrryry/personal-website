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

# Step 1: Integrate identity file
echo "Integrating identity file..."
echo "$SSH_PRIVATE_KEY" | tee $DEPLOY_KEY_PATH
chmod -R 600 $DEPLOY_KEY_PATH

eval `ssh-agent`
ssh-add -k $DEPLOY_KEY_PATH

# Step 1: SSH into the server
echo "Connecting to the server..."
ssh -o StrictHostKeyChecking=no -tt -i $DEPLOY_KEY_PATH -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST << EOF
  cd $REMOTE_PATH
  git pull
  docker compose up --build portfolio -d
  exit
EOF



# Clean up the key after use
rm -f $DEPLOY_KEY_PATH

echo "Deployment completed successfully!"