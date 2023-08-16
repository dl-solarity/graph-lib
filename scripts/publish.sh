#!/usr/bin/bash

cp -r ./README.md ./LICENSE ./lib/ ./publish
npm publish ./publish/ --access public
source ./scripts/clean.sh
