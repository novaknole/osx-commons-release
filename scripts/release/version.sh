#!/usr/bin/env bash

set -euo pipefail

organization=@aragon

# Define the mapping as an associative array
mapping="contracts:osx-commons-contracts configs:osx-commons-configs sdk:osx-commons-sdk artifacts:osx-dev-artifacts"

package="${REF_NAME##*-}"

echo $REF_NAME
echo $package

echo "Looping through keys and values:"

for pair in $mapping; do
    key="${pair%%:*}"
    value="${pair#*:}"

    if [[ "$key" != "$package" ]]; then
        changeset version --ignore $organization/$value
    fi
done

