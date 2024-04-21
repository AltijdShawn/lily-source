#!/usr/bin/env bash
ROOT=../..
TSC="npx tsc"
TSC2="./node_modules/.bin/tsc"

if [ ${1} == "all" ]; then
bash ./build-config.sh "$ROOT" "$TSC"
bash ./build-utils.sh "$ROOT" "$TSC"
bash ./build-bot.sh "$ROOT" "$TSC2"
elif [ ${1} == "config" ]; then
bash ./build-config.sh "$ROOT" "$TSC"
elif [ ${1} == "utils" ]; then
bash ./build-utils.sh "$ROOT" "$TSC"
elif [ ${1} == "bot" ]; then
bash ./build-bot.sh "$ROOT" "$TSC2"
echo "W.I.P"
else
bash ./build-config.sh "$ROOT" "$TSC"
bash ./build-utils.sh "$ROOT" "$TSC"
bash ./build-bot.sh "$ROOT" "$TSC2"
fi