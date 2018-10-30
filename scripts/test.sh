#!/usr/bin/env bash

exec 3< <(autocannon -d 20 -c 100 http://localhost:3000/a 2>&1)
exec 4< <(autocannon -d 20 -c 100 http://localhost:3000/b 2>&1)
exec 5< <(autocannon -d 20 -c 100 http://localhost:3000/c 2>&1)

cat <&3
echo
cat <&4
echo
cat <&5
