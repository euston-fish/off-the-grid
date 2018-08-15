GCC=google-closure-compiler
GCCFLAGS=--compilation_level ADVANCED_OPTIMIZATIONS --externs externs.js --language_out ECMASCRIPT_2015

.PHONY: all run clean squeaky fix

all: build/public/server.js build/public/shared.js build/public/index.html build/js13kserver
	
run: all
	cd build/js13kserver; npm run start

build/public/shared.js: src/shared.js src/server.js src/client.js src/index.js | build/public
	$(GCC) $(GCCFLAGS) $^ --js_output_file $@

build/public/server.js: | build/public
	touch $@

build/public/index.html: src/index.html | build/public
	cp $< $@

build/js13kserver: build/js13kserver.zip | build/public
	unzip $^
	mv js13kserver-master build/js13kserver
	rm -r build/js13kserver/public
	ln -s ../public build/js13kserver/public
	cd build/js13kserver; npm install
	
build/js13kserver.zip: | build
	curl -L https://github.com/js13kgames/js13kserver/archive/master.zip -o $@

build/public: | build
	mkdir build/public

build:
	mkdir build

clean:
	rm -r build/public

squeaky: clean
	rm -r build

fix:
	eslint --fix src/**/*.js
