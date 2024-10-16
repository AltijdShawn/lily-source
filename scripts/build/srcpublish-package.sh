#!/usr/bin/env bash
ROOT=${1}
# TSC=${2}

SCRIPT_DIR="$(pwd)"
PKG_DIR="$ROOT/packages"

CONFIG_DIR="$PKG_DIR/config"
UTILS_DIR="$PKG_DIR/utils"
BOT_DIR="$PKG_DIR/bot"

TARGET_DIR="$ROOT/source-only"

TARGET_PKG_DIR="$TARGET_DIR/packages"

TEMPL_DIR="$ROOT/publish-templates"

CONF_DIR="$TARGET_PKG_DIR/config/src"

cd "$SCRIPT_DIR"

echo "Initializing... (This may take a moment, but it also may not)"

echo "[INITIALIZATION]: Removing old files (If they exist)"
rm -rf "$TARGET_DIR/packages"
rm -rf "$TARGET_DIR/publish-templates"
rm -rf "$TARGET_DIR/scripts"
rm -rf "$TARGET_DIR/.gitignore"
rm -rf "$TARGET_DIR/package.json"
rm -rf "$TARGET_DIR/README.md"
rm -rf "$TARGET_DIR/yarn.lock"
echo "[INITIALIZATION]: Creating target folder (If it doesn't already exist)"
mkdir $TARGET_DIR

echo "[INITIALIZATION]: DONE!"

echo "[COPY]: Copying root workspace files"
cp "$ROOT/.gitignore" "$TARGET_DIR/.gitignore"
cp "$ROOT/package.json" "$TARGET_DIR/package.json"
cp "$ROOT/yarn.lock" "$TARGET_DIR/yarn.lock"

echo "[COPY]: Copying scripts folder"
cp -r "$ROOT/scripts/" "$TARGET_DIR/scripts/"

echo "[COPY]: Copying templates folder"
cp -r "$TEMPL_DIR/" "$TARGET_DIR/publish-templates/"


echo "[MKDIR]: Creating package directories"
mkdir -p "$TARGET_PKG_DIR/config" "$TARGET_PKG_DIR/utils" "$TARGET_PKG_DIR/bot"

echo "[COPY]: Copying packages/config workspace files"
cp "$PKG_DIR/config/package.json" "$TARGET_PKG_DIR/config/package.json"
cp "$PKG_DIR/config/tsconfig.json" "$TARGET_PKG_DIR/config/tsconfig.json"

echo "[COPY]: Copying packages/utils workspace files"
cp "$PKG_DIR/utils/package.json" "$TARGET_PKG_DIR/utils/package.json"
cp "$PKG_DIR/utils/tsconfig.json" "$TARGET_PKG_DIR/utils/tsconfig.json"

echo "[COPY]: Copying packages/bot workspace files"
cp "$PKG_DIR/bot/package.json" "$TARGET_PKG_DIR/bot/package.json"
cp "$PKG_DIR/bot/tsconfig.json" "$TARGET_PKG_DIR/bot/tsconfig.json"

echo "[COPY]: Starting to copy source files"

echo "[COPY]: Copying config source files"
cp -r "$PKG_DIR/config/src" "$TARGET_PKG_DIR/config/src"

echo "[COPY]: Copying utils source files"
cp -r "$PKG_DIR/utils/src" "$TARGET_PKG_DIR/utils/src"

echo "[COPY]: Copying bot source files"
cp -r "$PKG_DIR/bot/src" "$TARGET_PKG_DIR/bot/src"

echo "[SECURITY]: Imma replace the configs with templates"

echo "[TEMPLATE]: $CONF_DIR/winkdiceConf.ts"
TEMPLATE=$(cat "$TEMPL_DIR/winkdiceConf.template.ts")
echo "$TEMPLATE"
echo "$TEMPLATE" > "$CONF_DIR/winkdiceConf.ts" 

echo "[TEMPLATE]: $CONF_DIR/chatbots/tokens.ts"
TEMPLATE=$(cat "$TEMPL_DIR/tokens.template.ts")
echo "$TEMPLATE"
echo "$TEMPLATE" > "$CONF_DIR/chatbots/tokens.ts" 

echo "[TEMPLATE]: $CONF_DIR/chatbots/client.ts"
TEMPLATE=$(cat "$TEMPL_DIR/client.template.ts")
echo "$TEMPLATE"
echo "$TEMPLATE" > "$CONF_DIR/chatbots/client.ts"

echo "[TEMPLATE]: $CONF_DIR/chatbots/maps.ts"
TEMPLATE=$(cat "$TEMPL_DIR/maps.template.ts")
echo "$TEMPLATE"
echo "$TEMPLATE" > "$CONF_DIR/chatbots/maps.ts" 

echo "[TEMPLATE]: And also adding the README.md file"
echo "[TEMPLATE]: $TARGET_DIR/README.md"
TEMPLATE=$(cat "$TEMPL_DIR/source-only.template.md")
echo "$TEMPLATE"
echo "$TEMPLATE" > "$TARGET_DIR/README.md" 