#!/bin/bash

RELEASE_PREFIX=Version
BASEDIR=$(dirname $0)

filePathChangelogGeneration="${BASEDIR}/./generate-changelog.sh"

branchNameCurrent=`git rev-parse --abbrev-ref HEAD`
branchNameReleaseFrom=dev
branchNameReleaseTo=master
if [[ $branchNameCurrent != $branchNameReleaseFrom ]]; then
	echo "Current branch is '${branchNameCurrent}', but you need to be on '${branchNameReleaseFrom}' to make a release"
	exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
	echo "There are changes. Commit first."
	exit 1
fi

re="\"version\"\:[[:space:]]*\"(([[:digit:]]+)\.([[:digit:]]+)\.([[:digit:]]+))\""
while read line; do
	if [[ $line =~ $re ]]; then
		currentVersion=${BASH_REMATCH[1]}
		currentVersionMajor=${BASH_REMATCH[2]}
		currentVersionMinor=${BASH_REMATCH[3]}
		currentVersionPatch=${BASH_REMATCH[4]}
	fi
done < package.json

if [[ $1 == 'patch' ]]; then
	enteredVersionMajor=${currentVersionMajor}
	enteredVersionMinor=${currentVersionMinor}
	enteredVersionPatch=$(($currentVersionPatch + 1))
	enteredVersion="${enteredVersionMajor}.${enteredVersionMinor}.${enteredVersionPatch}"
elif [[ $1 == 'minor' ]]; then
	enteredVersionMajor=${currentVersionMajor}
	enteredVersionMinor=$(($currentVersionMinor + 1))
	enteredVersionPatch=0
	enteredVersion="${enteredVersionMajor}.${enteredVersionMinor}.${enteredVersionPatch}"
elif [[ $1 == 'major' ]]; then
	enteredVersionMajor=$(($currentVersionMajor + 1))
	enteredVersionMinor=0
	enteredVersionPatch=0
	enteredVersion="${enteredVersionMajor}.${enteredVersionMinor}.${enteredVersionPatch}"
else
	re="(([[:digit:]]+)\.([[:digit:]]+)\.([[:digit:]]+))"
	if ! [[ $1 =~ $re ]]; then
		echo "Release number is wrong"
		exit 1
	fi

	enteredVersion=${BASH_REMATCH[1]};
	enteredVersionMajor=${BASH_REMATCH[2]};
	enteredVersionMinor=${BASH_REMATCH[3]};
	enteredVersionPatch=${BASH_REMATCH[4]};
fi

if
	[[ $enteredVersionMajor < $currentVersionMajor ]] ||
	[[ $enteredVersionMajor == $currentVersionMajor && $enteredVersionMinor < $currentVersionMinor ]] ||
	[[ $enteredVersionMajor == $currentVersionMajor && $enteredVersionMinor == $currentVersionMinor  && $enteredVersionPatch < $currentVersionPatch+1 ]]; then
	echo "Entered version ($enteredVersion) isn't above current ($currentVersion)"
	exit 1
fi

echo "Starting a new release: $enteredVersion"

filesToReplace=(
	package.json
	src/templates/parts/_footer.nunj
)

for file in "${filesToReplace[@]}"
do
	sed -i '' "s/$currentVersion/$enteredVersion/g" "$file"
done

git checkout "${branchNameReleaseTo}" && git pull origin "${branchNameReleaseTo}"
git merge --squash --no-commit -X theirs "${branchNameReleaseFrom}" && git commit -m "${RELEASE_PREFIX} ${enteredVersion}"
lastCommitHash=`git log --pretty='format:%h' -1`
git tag -a v"${$enteredVersion}" -m "${RELEASE_PREFIX} ${enteredVersion}" "${lastCommitHash}"
git push --tags

/bin/bash "${filePathChangelogGeneration}"
git add .
git commit --amend
#git push origin "${branchNameReleaseTo}"
