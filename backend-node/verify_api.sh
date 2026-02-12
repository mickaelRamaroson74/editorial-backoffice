#!/bin/bash

BASE_URL="http://localhost:3000/api"

echo "Testing API..."

# Create Network
echo "Creating Network..."
NETWORK_RESPONSE=$(curl -s -X POST $BASE_URL/networks \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Network", "description": "Test Description"}')
echo $NETWORK_RESPONSE
NETWORK_ID=$(echo $NETWORK_RESPONSE | grep -o '"id":"[^"]*"' | head -1 | cut -d':' -f2 | tr -d '"')
echo "Network ID: $NETWORK_ID"

# Create Category
echo "Creating Category..."
CATEGORY_RESPONSE=$(curl -s -X POST $BASE_URL/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Category", "slug": "test-category", "description": "Test Description", "color": "#ff0000"}')
echo $CATEGORY_RESPONSE
CATEGORY_ID=$(echo $CATEGORY_RESPONSE | grep -o '"id":"[^"]*"' | head -1 | cut -d':' -f2 | tr -d '"')
echo "Category ID: $CATEGORY_ID"

# Create Article
echo "Creating Article..."
ARTICLE_RESPONSE=$(curl -s -X POST $BASE_URL/articles \
  -H "Content-Type: application/json" \
  -d "{\"title\": "Test Article", \"content\": \"Test Content\", \"excerpt\": \"Test Excerpt\", \"author\": \"Test Author\", \"network\": \"$NETWORK_ID\", \"categoryIds\": [\"$CATEGORY_ID\"]}")
echo $ARTICLE_RESPONSE

echo "Verification Complete!"
