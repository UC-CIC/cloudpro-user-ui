#!/bin/bash

npm install
npm run build production
aws s3 sync build/ s3://cdk-userportal-stack-dev-bucketuserportaldev91ad42-pugg2wh6omee