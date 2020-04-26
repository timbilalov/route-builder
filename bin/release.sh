#!/bin/bash

re="(([[:digit:]]+)\.([[:digit:]]+)\.([[:digit:]]+))"
if ! [[ $1 =~ $re ]]; then
	echo "Release number is wrong"
	exit 1
fi

enteredVersion=${BASH_REMATCH[1]};
enteredVersionMajor=${BASH_REMATCH[2]};
enteredVersionMinor=${BASH_REMATCH[3]};
enteredVersionPatch=${BASH_REMATCH[4]};

re="\"version\"\:[[:space:]]*\"(([[:digit:]]+)\.([[:digit:]]+)\.([[:digit:]]+))\""
while read line; do
	if [[ $line =~ $re ]]; then
		currentVersion=${BASH_REMATCH[1]};
		currentVersionMajor=${BASH_REMATCH[2]};
		currentVersionMinor=${BASH_REMATCH[3]};
		currentVersionPatch=${BASH_REMATCH[4]};
	fi
done < package.json

if
	[[ $enteredVersionMajor < $currentVersionMajor ]] ||
	[[ $enteredVersionMinor < $currentVersionMinor ]] ||
	[[ $enteredVersionMajor == $currentVersionMajor && $enteredVersionMinor == $currentVersionMinor  && $enteredVersionPatch < $currentVersionPatch+1 ]]; then
	echo "Entered version ($enteredVersion) isn't above current ($currentVersion)"
	exit 1
fi

filesToReplace=(
	package.json
	src/templates/parts/_footer.nunj
)

for file in "${filesToReplace[@]}"
do
	sed -i '' "s/$currentVersion/$enteredVersion/g" "$file"
done

echo "New version specified: $enteredVersion"
