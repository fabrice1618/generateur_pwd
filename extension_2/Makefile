DESKTOP_DIR = /mnt/c/Users/rudya/Desktop

.PHONY: build dev help

build:
	npm run build
	mkdir -p $(DESKTOP_DIR)
	rm -rf $(DESKTOP_DIR)/extension_dist
	cp -r dist $(DESKTOP_DIR)/extension_dist

dev:
	npm run dev

help:
	@echo "Available targets:"
	@echo "  build  - Build the project and copy dist to Windows desktop"
	@echo "  dev    - Run the development server"
	@echo "  help   - Show this help message"

	