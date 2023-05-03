#!/usr/bin/bash

mv ./publish/package.json ./scripts
rm -r ./publish/*
mv ./scripts/package.json ./publish/
