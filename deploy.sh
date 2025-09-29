#!/bin/bash

S3_BUCKET="blog-mshin"
BUILD_DIR="public/"
DISTRIBUTION_ID="EAVL517Q9QH8O"

# Upload to Amazon S3
# 例外3ファイル（BUILD_DIR からの相対パスで記載）
EX1="page-data/using-typescript/page-data.json"
EX2="rss.xml"
EX3="using-typescript/index.html"

echo "Sync contents file updated the original size."
aws s3 sync "$BUILD_DIR" "s3://$S3_BUCKET" \
  --delete \
  --size-only \
  --exclude "$EX1" \
  --exclude "$EX2" \
  --exclude "$EX3"

echo "Sync build timestamps."
aws s3 sync "$BUILD_DIR" "s3://$S3_BUCKET" \
  --delete \
  --exclude "*" \
  --include "$EX1" \
  --include "$EX2" \
  --include "$EX3"

echo "Deployment to S3 completed."

# Create invalidation
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
echo "Invalidation for CloudFront has been requested."