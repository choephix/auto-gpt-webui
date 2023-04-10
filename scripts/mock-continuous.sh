#!/bin/bash

while true; do
  random_string=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 64 | head -n 1)
  echo "$random_string"
  sleep 0.2
done
