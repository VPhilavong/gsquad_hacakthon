#!/bin/bash

# Create a virtual environment (if it doesn't exist)
if [ ! -d "venv" ]; then
  python3 -m venv venv
  echo "Virtual environment created."
fi