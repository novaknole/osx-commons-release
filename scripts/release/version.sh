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

eval $command


# 1. To release rc versions multiple times, merge changeset-release/release-* into release-* which will 
# release that alpha version. Then do some changes, add another .changeset file and make a PR to release-* branch.
# Once merged, the PR will again be created with updated. Merge this and another rc candidate will be published.

# If PR is created with rc and you run workflow on `main` branch again, it will just re-update the PR.
# If the `release-*` branch exists, you shouldn’t run workflow from main. In such cases, changes must be pushed with PRs to `release-*` branch, otherwise, problem could be that if you merged rc(because of publish) from changeset-release/release-* into release-*, release-* now contains the extra commits, and when we run workflow from main, it tries to create `git checkout -b release-*`(see start.sh), and then when pushed a commit, and do git push origin release branch, it fails because remote branch contains more, so it’s required to first pull which seems dangerous.
# We could do fetch-depth: 0, but then in that case, git checkout -b release-* won’t work, so we would need to first check if it exists. Maybe it’s better that it fails in such cases, it’s anyways a safer way. 
