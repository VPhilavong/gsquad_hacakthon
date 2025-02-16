#!/bin/bash

# Get the absolute path of the directory where the script is located
SCRIPT_DIR=$(dirname "$(realpath "$0")")

# Specify the relative paths from the script directory
PROJECT_DIR="$SCRIPT_DIR"  # Assuming the script is in the main project directory
NPM_DIR="$SCRIPT_DIR/p1/profile"  # Assuming "profile" is a subdirectory of the project

# Change into the project directory to set up the virtual environment
cd "$PROJECT_DIR" || { echo "Project directory not found! Exiting..."; exit 1; }


# Install Python dependencies
pip3 install -r requirements.txt

# Change to the /profile directory for npm install
cd "$NPM_DIR" || { echo "Profile directory not found! Exiting..."; exit 1; }

# Install Node.js dependencies
npm install
