#!/usr/bin/env bash
ROOT=../..
TSC="npx tsc"
TSC2="./node_modules/.bin/tsc"

if [ ${1} == "all" ]; then
bash ./build-config.sh "$ROOT" "$TSC"
bash ./build-utils.sh "$ROOT" "$TSC"
bash ./build-bot.sh "$ROOT" "$TSC2"
bash ./build-test.sh "$ROOT" "$TSC2"
elif [ ${1} == "config" ]; then
echo "W.I.P"
bash ./build-config.sh "$ROOT" "$TSC"
elif [ ${1} == "utils" ]; then
echo "W.I.P"
bash ./build-utils.sh "$ROOT" "$TSC"
elif [ ${1} == "bot" ]; then
echo "W.I.P"
bash ./build-bot.sh "$ROOT" "$TSC2"
elif [ ${1} == "test" ]; then
echo "W.I.P"
bash ./build-test.sh "$ROOT" "$TSC2"
else
bash ./build-config.sh "$ROOT" "$TSC"
bash ./build-utils.sh "$ROOT" "$TSC"
bash ./build-bot.sh "$ROOT" "$TSC2"
bash ./build-test.sh "$ROOT" "$TSC2"
fi