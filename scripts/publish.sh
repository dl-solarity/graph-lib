#!/usr/bin/bash

cp -r ./README.md ./LICENSE ./modules/ ./publish
npm publish ./publish/ --access public
rm -r ./publish/!(package.json)
