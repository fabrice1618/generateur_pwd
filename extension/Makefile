SHELL := /bin/bash
.PHONY: up build install dev clean

# Start dev server
up:
	npm run dev

# Build production bundle (extension)
build:
	npm run build:extension

install:
	npm install

clean:
	rm -rf dist node_modules
