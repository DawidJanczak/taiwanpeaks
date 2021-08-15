SHELL := /bin/bash

.PHONY: build
build:
	set -e; \
	npx snowpack build; \
	cd build; \
	for file in {*.css,*.js}; do \
		hash=$$(md5sum $${file} | awk '{ print $$1 }'); \
		base="$${file%.*}"; \
		extension="$${file##*.}"; \
		new_name="$${base}.$${hash}.$${extension}"; \
		mv $${file} $${new_name}; \
		sed -i -E "s|/?$${file}|$${new_name}|" index.html; \
	done;
