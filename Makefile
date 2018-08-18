GCC=google-closure-compiler
GCCFLAGS=--compilation_level ADVANCED_OPTIMIZATIONS --externs externs.js --language_out ECMASCRIPT_2015
GCCFLAGS_DEBUG=--create_source_map $@.map --source_map_include_content
SOURCES=src/Array.js \
        src/Lens.js \
        src/Block.js \
        src/BlockManager.js \
        src/shared.js \
        src/server.js \
        src/client.js \
        src/grid_item.js \
        src/index.js
OUTPUTS=shared.js server.js index.html

.PHONY: debug_run release_run clean squeaky lint fix
	
debug: $(addprefix debug/public/,$(OUTPUTS)) | debug/js13kserver

debug_run: debug
	cd debug; npm run start

debug/public/shared.js: $(SOURCES) externs.js
	$(GCC) $(GCCFLAGS) $(GCCFLAGS_DEBUG) $(SOURCES) --js_output_file $@
	echo "//# sourceMappingURL=shared.js.map" >> $@

%/public/server.js:
	touch $@

%/public/index.html: src/index.html
	cp $< $@

release: $(addprefix release/public/,$(OUTPUTS)) release/js13kserver

release_run: release
	cd release; npm run start

release/public/shared.js: $(SOURCES) externs.js
	$(GCC) $(GCCFLAGS) $(SOURCES) --js_output_file $@

%/js13kserver: js13kserver.zip
	unzip $^ -x js13kserver-master/public/*
	mv js13kserver-master/* $(dir $@)
	rm -rf js13kserver-master
	#rm -r $(dir $@)/public
	cd $(dir $@); npm install
	touch $@

js13kserver.zip:
	curl -L https://github.com/js13kgames/js13kserver/archive/master.zip -o $@

clean:
	rm -rf debug/public release/public

squeaky: clean
	rm -rf debug release js13kserver.zip

lint:
	eslint src/**/*.js

fix:
	eslint --fix src/**/*.js
