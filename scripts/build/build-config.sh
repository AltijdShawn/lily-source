#!/usr/bin/env bash
ROOT=${1}
TSC=${2}

SCRIPT_DIR="$(pwd)"
PKG_DIR="$ROOT/packages"

cd "$PKG_DIR/config"

echo "-------------------------------------------------"
echo ""
echo "Started build of 'config';"
echo "  ($(pwd))"
echo "-------------------------------------------------"

yarn install -F
yarn add -D typescript

$TSC -p ./tsconfig.json

echo ""
echo "Build of 'config' is finished!;"
echo ""
