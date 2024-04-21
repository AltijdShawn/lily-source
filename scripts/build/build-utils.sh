#!/usr/bin/env bash
ROOT=${1}
TSC=${2}

SCRIPT_DIR="$(pwd)"
PKG_DIR="$ROOT/packages"

cd "$PKG_DIR/utils"

echo "-------------------------------------------------"
echo ""
echo "Started build of 'utils';"
echo "  ($(pwd))"
echo "-------------------------------------------------"

yarn add -D typescript

$TSC -p ./tsconfig.json

echo ""
echo "Build of 'utils' is finished!;"
echo ""
