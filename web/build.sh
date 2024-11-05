#!/bin/bash
if [ -d "./dist" ]; then
    rm -r ./dist
fi
mkdir -p ./dist
mkdir -p ./dist/css
cp ./src/*.html ./dist/
cp -r ./src/sample-data ./dist/
npx tsc
npx sass --no-source-map --style=compressed ./src/css/main.scss:./dist/css/main.css
npx fix-esm-import-path ./dist/js/