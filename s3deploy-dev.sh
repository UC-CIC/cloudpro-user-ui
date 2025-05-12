#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Install project dependencies
npm install

# Build the project in development mode
npm run build development

# Sync the build directory with the specified S3 bucket
aws s3 sync build/ s3://cdk-userportal-stack-dev-bucketuserportaldev91ad42-pugg2wh6omee