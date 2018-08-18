# Off The Grid

> a work-in-progress entry for JS13kGames 2018

## Prerequisites

Ensure you have `make`, `bash`, `npm`, `unzip`, [`google-closure-compiler`](https://www.npmjs.com/package/google-closure-compiler), [`eslint`](https://eslint.org), and [`jsdoc`](https://usejsdoc.org).

## Build

* To build the debug version with source maps, `make debug`
* To build the release version, `make release`

## Run

* To run the debug version with source maps, `make debug_run`
* To run the release version, `make release_run`

## Develop

* Edit files under `src`
* To lint the project, `make lint`
* To fix correctable errors, `make fix`
* In debug mode, set `window.debugParams` to a list of keys of params to debug on the grid

## Todo

- Make build tools for compressing and measuring
- Maybe use less `make`
