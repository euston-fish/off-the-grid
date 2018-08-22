SHELL=/usr/bin/env bash
GCC=google-closure-compiler
GCCFLAGS=--compilation_level ADVANCED_OPTIMIZATIONS --externs externs.js --language_out ECMASCRIPT_2015
GCCFLAGS_DEBUG=--create_source_map $@.map --source_map_include_content
SOURCES=src/Array.js \
        src/Number.js \
        tmp/constants.js \
        src/Lens.js \
        src/Block.js \
        src/BlockManager.js \
        tmp/game.js \
        src/Game.js \
        src/shared.js \
        src/server.js \
        src/client.js \
        src/GridItem.js \
        src/draw.js \
        src/index.js
OUTPUTS=shared.js server.js index.html

.PHONY: all debug_run release_run clean squeaky lint fix install

all: lint release doc

install:

tmp/game.js: src/game.js.sh tmp/game.wasm | tmp
	bash $< tmp/game.wasm > $@

tmp/game.wasm: tmp/game_rustc.wasm | tmp
	wasm-opt $< -Oz -o $@

tmp/%: src/%.sh src/constants.json | tmp
	bash $< src/constants.json > $@

tmp/game_rustc.wasm: src/game.rs tmp/constants.rs | tmp
	rustc \
	  --crate-type=cdylib \
	  --target=wasm32-unknown-unknown \
	  --codegen lto \
	  --codegen debuginfo=0 \
	  --codegen opt-level='z' \
	  --codegen panic=abort \
	  <(cat $^) -o $@ # that cat is a gross hack, but I don't know how to Rust better

tmp:
	mkdir tmp
	
debug: $(addprefix debug/public/,$(OUTPUTS)) | debug/js13kserver

debug_run: debug
	cd debug; npm i; npm run start

debug/public/shared.js: $(SOURCES) externs.js
	$(GCC) $(GCCFLAGS) $(GCCFLAGS_DEBUG) <(echo "const DEBUG=true") $(SOURCES) --js_output_file $@
	echo "//# sourceMappingURL=shared.js.map" >> $@

%/public/server.js:
	touch $@

%/public/index.html: src/index.html
	cp $< $@

release: $(addprefix release/public/,$(OUTPUTS)) release/js13kserver

release_run: release
	cd release; npm i; npm run start

release/public/shared.js: $(SOURCES) externs.js
	$(GCC) $(GCCFLAGS) <(echo "const DEBUG=false") $(SOURCES) --js_output_file $@

%/js13kserver: js13kserver.zip
	unzip $^ -x js13kserver-master/public/*
	mv js13kserver-master/* $(dir $@)
	rm -rf js13kserver-master
	touch $@

js13kserver.zip:
	curl -L https://github.com/js13kgames/js13kserver/archive/master.zip -o $@

clean:
	rm -rf debug/public release/public doc tmp

squeaky: clean
	rm -rf debug release js13kserver.zip

lint:
	eslint src/**/*.js

fix:
	eslint --fix src/**/*.js

doc: $(SOURCES)
	jsdoc -d doc $(SOURCES)

draw: $(SOURCES) src/draw_image.js
	$(GCC) $(GCCFLAGS) <(echo "const DEBUG=false") src/draw_image.js $(SOURCES) --entry_point=src/draw_image --js_output_file debug/draw.js
	node debug/draw.js
