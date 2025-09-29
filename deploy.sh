#!/bin/bash

S3_BUCKET="blog-mshin"
BUILD_DIR="public/"
DISTRIBUTION_ID="EAVL517Q9QH8O"

# Upload to Amazon S3
# 1) アセット類・画像など → size-only でアップロード最小化
aws s3 sync "$BUILD_DIR" "s3://$S3_BUCKET" \
  --delete \
  --exclude "*.html" \
  --exclude "page-data/*" \
  --exclude "rss.xml" \
  --size-only

# 2) HTML / page-data → デフォルト（サイズ＋時刻）で確実に反映
aws s3 sync "$BUILD_DIR" "s3://$S3_BUCKET" \
  --delete \
  --exclude "*" \
  --include "*.html" \
  --include "page-data/*" \
  --include "rss.xml"
echo "Deployment to S3 completed."

# Create invalidation
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
echo "Invalidation for CloudFront has been requested."