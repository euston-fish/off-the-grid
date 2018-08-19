{ pkgs ? import <nixpkgs> {
  overlays = [ (import ("${builtins.fetchTarball https://github.com/mozilla/nixpkgs-mozilla/archive/master.tar.gz}/rust-overlay.nix")) ];
} }:
  with pkgs;
  let closurecompiler_new = 
    stdenv.mkDerivation rec {
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
    wabt = stdenv.mkDerivation rec {
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
  in
    stdenv.mkDerivation {
      name = "off-the-grid";
      buildInputs = [
        nodejs-8_x
        nodePackages.eslint
        nodePackages.jsdoc
        closurecompiler_new
        unzip
        (pkgs.latest.rustChannels.nightly.rust.override {
          targets = [ "wasm32-unknown-unknown" ];
        })
        wabt # This gives some tools for wasm
        binaryen # This gives some more tools for wasm
      ];
    }



