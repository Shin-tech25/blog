#!/bin/bash

S3_BUCKET="blog-mshin"
BUILD_DIR="public/"

# S3にアップロード
aws s3 sync $BUILD_DIR s3://$S3_BUCKET --delete

echo "Deployment to S3 completed!"
