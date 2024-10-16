#!/usr/bin/env bash
ROOT=${1}
TSC=${2}

SCRIPT_DIR="$(pwd)"
PKG_DIR="$ROOT/packages"

cd "$PKG_DIR/test"

echo "-------------------------------------------------"
echo ""
echo "Started build of 'test';"
echo "  ($(pwd))"
echo "-------------------------------------------------"

yarn install -F
yarn add -D typescript

# $TSC -p ./tsconfig.json
/bin/tsc -p ./tsconfig.json

echo ""
echo "Build of 'test' is finished!;"
echo ""
