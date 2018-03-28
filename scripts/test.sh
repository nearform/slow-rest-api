#!/bin/sh

DURATION=20

trap 'kill %1; kill %2; kill %3' SIGINT;

autocannon -d "$DURATION" -c 100 http://localhost:3000/a &
autocannon -d "$DURATION" -c 100 http://localhost:3000/b &
autocannon -d "$DURATION" -c 100 http://localhost:3000/c &
sleep "$DURATION"
exit 0
