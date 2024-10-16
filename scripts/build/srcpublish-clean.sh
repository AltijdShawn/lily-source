#!/usr/bin/env bash
ROOT=${1}
# TSC=${2}

SCRIPT_DIR="$(pwd)"
PKG_DIR="$ROOT/packages"

CONFIG_DIR="$PKG_DIR/config"
UTILS_DIR="$PKG_DIR/utils"
BOT_DIR="$PKG_DIR/bot"

cd "$SCRIPT_DIR"

if [ ${2} == "verbose" ]; then
echo "[VERBOSE]"
RM_RF_FLAGS="-rfv"
else
echo "[NON-VERBOSE] (to enable do '<script> [ROOT] verbose')"
RM_RF_FLAGS="-rf"
fi

echo "Starting to sweep build directories"
echo "    - utils/dist"
rm $RM_RF_FLAGS "$UTILS_DIR/dist"
echo "    - config/dist"
rm $RM_RF_FLAGS "$CONFIG_DIR/dist"
echo "    - bot/dist"
rm $RM_RF_FLAGS "$BOT_DIR/dist"
echo "    - bot/node_modules"
rm $RM_RF_FLAGS "$BOT_DIR/node_modules"