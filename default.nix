{ pkgs ? import <nixpkgs> {
  overlays = [
    (import ("${builtins.fetchTarball https://github.com/mozilla/nixpkgs-mozilla/archive/master.tar.gz}/rust-overlay.nix"))
    (self: super: {
      closurecompiler = with self; stdenv.mkDerivation rec {
        name = "closure-compiler-${version}";
        version = "20180716";

        src = fetchurl {
          url = "https://dl.google.com/closure-compiler/compiler-${version}.tar.gz";
          sha256 = "06yc85pbcw1v36j12qwxkk0pbhziglp3zjkv3xza2v68zvyqy6hd";
        };

        sourceRoot = ".";

        nativeBuildInputs = [ makeWrapper ];
        buildInputs = [ jre ];

        installPhase = ''
          mkdir -p $out/share/java $out/bin
          cp closure-compiler-v${version}.jar $out/share/java
          makeWrapper ${jre}/bin/java $out/bin/google-closure-compiler \
            --add-flags "-jar $out/share/java/closure-compiler-v${version}.jar"
        '';

        meta = with stdenv.lib; {
          description = "A tool for making JavaScript download and run faster";
          homepage = https://developers.google.com/closure/compiler/;
          license = licenses.asl20;
          platforms = platforms.all;
        };
      };
      wabt = with self; stdenv.mkDerivation rec {
        name = "wabt";

        src = fetchFromGitHub {
          sha256 = "1r10sd8qa72rzdghjswjn3p3yx18g1sa88baj2892wpazz3k62rs";
          rev = "f835db8cfb418bb19dd61a10dbe49e1131b664bc";
          repo = "wabt";
          owner = "WebAssembly";
        };

        buildInputs = [ gcc cmake python ];

        cmakeFlags = [ "-DBUILD_TESTS=OFF" ];
      };
      binaryen = with self; stdenv.mkDerivation rec {
        version = "42";
        rev = "version_${version}";
        name = "binaryen-${version}";

        src = fetchFromGitHub {
          owner = "WebAssembly";
          repo = "binaryen";
          sha256 = "0b8qc9cd7ncshgfjwv4hfapmwa81gmniaycnxmdkihq9bpm26x2k";
          inherit rev;
        };

        nativeBuildInputs = [ cmake ];

        meta = with stdenv.lib; {
          homepage = https://github.com/WebAssembly/binaryen;
          description = "Compiler infrastructure and toolchain library for WebAssembly, in C++";
          platforms = platforms.all;
          maintainers = with maintainers; [ asppsa ];
          license = licenses.asl20;
        };
      };
    })
  ];
} }:
  with pkgs; stdenv.mkDerivation {
    name = "off-the-grid";
    buildInputs = [
      nodejs-8_x
      nodePackages.eslint
      nodePackages.jsdoc
      closurecompiler
      unzip
      curl
      jq
      (pkgs.latest.rustChannels.nightly.rust.override {
        targets = [ "wasm32-unknown-unknown" ];
      })
      wabt # This gives some tools for wasm
      binaryen # This gives some more tools for wasm
      makeWrapper
    ];
    src = ./.;
    js13kserver = fetchurl {
      url = https://github.com/js13kgames/js13kserver/archive/master.zip;
      sha256 = "1wxivky8g9dq7jbvl7kaiqh5qg5r6an7yyr1vzqf3qvd1h50rjkf";
    };
    preBuild = ''
      cp $js13kserver js13kserver.zip
      export HOME=$(mktemp -d) # Needed to make `npm i` work
    '';
    installPhase = ''
      mkdir -p $out
      cp -r release $out/release
      #makeWrapper ${nodejs-8_x}/bin/node $out/bin/off-the-grid --add-flags "index.js" --run "cd $out/release"
      cp -r doc $out/doc
    '';
  }
