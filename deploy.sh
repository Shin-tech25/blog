#!/bin/bash

S3_BUCKET="blog-mshin"
BUILD_DIR="public/"
DISTRIBUTION_ID="EAVL517Q9QH8O"

# Upload to Amazon S3
aws s3 sync "$BUILD_DIR" "s3://$S3_BUCKET" \
  --delete \
  --size-only
echo "Deployment to S3 completed."

# Create invalidation
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
echo "Invalidation for CloudFront has been requested."