#!/bin/bash

end=$((SECONDS+2))

while [ $SECONDS -lt $end ]; do
  for i in "." ".." "..."; do
    printf "\r%s" "$i"
    sleep 0.3
  done
done

# Move to a new line after the spinner stops
printf "\n"
