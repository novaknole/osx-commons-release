#!/usr/bin/env bash

set -euo pipefail

# TODO: change later

organization=@glagh

# Define the mapping as an associative array
mapping="contracts:commons-contracts configs:commons-configs sdk:commons-sdk artifacts:dev-artifacts"

package="sdk"

# echo $REF_NAME
echo $package

echo "Looping through keys and values:"
echo "oee"

command="npx changeset version"

for pair in $mapping; do
    key="${pair%%:*}"
    value="${pair#*:}"

    if [[ "$key" != "$package" ]]; then
        command+=" --ignore $organization/$value" 
    fi
done

echo $command 

eval "$command"

