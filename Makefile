.PHONY: all run clean

all: build/public/server.js build/public/client.js build/public/shared.js build/public/index.html build/js13kserver
	
run: all
	cd build/js13kserver; npm run start

build/public/server.js: src/server.js | build/public
	closure-compiler $^ --js_output_file $@

build/public/client.js: src/client.js | build/public
	closure-compiler $^ --js_output_file $@

build/public/shared.js: src/shared.js | build/public
	closure-compiler $^ --js_output_file $@

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
	rm -r build
