#!/bin/bash

project="musiko"

echo "Starting deployment of $project"

echo "Cleaning dist/ directory..."
ssh tt@tomastoews.de "rm -r -f -v /containers/$project && mkdir -p /containers/$project/dist"
echo "Cleaning done: ok"

echo "Preparing upload..."
rm -r -f -v dist/
mkdir dist/
cp -r app/* dist/
cp app/.* dist/
rm -r dist/node_modules
echo "Preparing done: ok"

echo "Uploading project dist/ files..."
scp -r dist/* dist/.env tt@tomastoews.de:/containers/$project/dist
rm -r dist/
echo "Upload done: ok"

echo "Uploading dockerfile and other files..."
scp Dockerfile .dockerignore tt@tomastoews.de:/containers/$project/
echo "Upload done: ok"

ssh tt@tomastoews.de "cd /containers/scripts && sh ./build-image.sh $project && sh ./start.sh $project 8085:3000"

echo "Image build done: ok"
echo "Container start done: ok"

echo "-----------------------"
echo "\| Deployment done: ok \|"
echo "-----------------------"
