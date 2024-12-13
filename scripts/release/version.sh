#!/usr/bin/env bash

set -euo pipefail

# TODO: change later

organization=@glagh

# Define the mapping as an associative array
mapping="contracts:commons-contracts configs:commons-configs sdk:commons-sdk"

package="${REF_NAME##*-}"

echo $REF_NAME
echo $package

echo "Looping through keys and values:"

command="changeset version"

for pair in $mapping; do
    key="${pair%%:*}"
    value="${pair#*:}"

    if [[ "$key" != "$package" ]]; then
        command+=" --ignore $organization/$value" 
    fi
done

echo $command
eval $command
