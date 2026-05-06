#!/bin/sh
set -eu

APP_URL="${APP_URL:-http://192.168.1.135:8085}"

echo "Open this app at: ${APP_URL}"

exec serve -s dist -l tcp://0.0.0.0:8085
