#!/usr/bin/env bash

set -euo pipefail

RELEASE_BRANCH="release-$PACKAGE"
git checkout -b "$RELEASE_BRANCH"

# Output branch
echo "branch=$RELEASE_BRANCH" >> $GITHUB_OUTPUT

# Enter in prerelease state
npx changeset pre enter alpha
git add .
git commit -m "Start release candidate"

# Push branch
if ! git push origin "$RELEASE_BRANCH"; then
  echo "Error: Can't push $RELEASE_BRANCH."
  exit 1
fi