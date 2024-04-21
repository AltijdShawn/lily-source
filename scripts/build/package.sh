#!/usr/bin/env bash

SCRIPT_DIR="$(pwd)"

echo "Cleaning dist folders and node_modules"
echo ""
echo ""
echo ""

bash "./srcpublish-clean.sh" "../.." nonverbose

sleep 1

echo "Packaging source files"
echo ""
echo ""
echo ""

bash "./srcpublish-package.sh" "../.."

sleep 1

echo "Packaging dist files"
echo ""
echo ""
echo ""

bash "./buildpublish-package.sh" "../.."

echo "DONE!"