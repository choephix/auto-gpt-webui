#!/bin/bash

end=$((SECONDS+2))

while [ $SECONDS -lt $end ]; do
  for i in "." ".." "..."; do
    printf "$i\r%s"
    sleep 0.3
  done
done

# Move to a new line after the spinner stops
printf "\n"
