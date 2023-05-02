#!/usr/bin/bash

cp -r ./README.md ./LICENSE ./modules ./publish
npm publish ./publish/ --access public
rm -r ./publish/README.md ./publish/LICENSE ./modules