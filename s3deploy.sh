#!/bin/bash

if [[ $# -eq 0 ]] ; then
    echo 'Provide S3 Bucket name'
    exit 0
fi

npm run build production
aws s3 sync build/ s3://$1