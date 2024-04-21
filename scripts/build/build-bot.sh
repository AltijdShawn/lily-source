#!/usr/bin/env bash
ROOT=${1}
TSC=${2}

SCRIPT_DIR="$(pwd)"
PKG_DIR="$ROOT/packages"

cd "$PKG_DIR/bot"

echo "-------------------------------------------------"
echo ""
echo "Started build of 'bot';"
echo "  ($(pwd))"
echo ""
echo "THIS DOESN'T DO ANYTHING YET SINCE WE STILL NEED TO PORT THE CODE OVER!"
echo ""
echo "-------------------------------------------------"

yarn install -F
yarn add -D typescript

$TSC -p ./tsconfig.json

echo ""
echo "Build of 'bot' is finished!;"
echo ""
