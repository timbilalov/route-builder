#!/bin/bash

function escapeSomeMarkdownChars {
	sed 's/\* \*/*/' | sed 's/\* \+/*/'
}

BASEDIR=$(dirname $0)
branchNameReleaseFrom=dev

# Set files paths
filePathTags="${BASEDIR}/../temp/tags.txt"
filePathDates="${BASEDIR}/../temp/tags-dates.txt"
filePathChangelog="${BASEDIR}/../CHANGELOG.md"
filePathChangelogTemp="${BASEDIR}/../CHANGELOG-TEMP.md"
filePathChangelogTemp2="${BASEDIR}/../CHANGELOG-TEMP2.md"

# Generate "raw" changelog file
github_changelog_generator

# Prepare dirs and files
mkdir -p "${BASEDIR}/../temp"
rm -rf "${filePathTags}"
rm -rf "${filePathDates}"
cp "${filePathChangelog}" "${filePathChangelogTemp}"

# Create tags file
git tag > "${filePathTags}"
tagsArray=()

# Create dates from tags,
# and fill a tags array
while read line; do
	git log --pretty='format:%ad' "$line~1..$line" >> "${filePathDates}"
	echo $'\r' >> "${filePathDates}"
	tagsArray+=("${line}")
done < "${filePathTags}"

# Create commits list for every release
# and merge it into "raw" changelog file
i=0
dateFrom=
while read line; do
	j=$(($j-$i))
	filePathHistory="${BASEDIR}/../temp/${tagsArray[i]}.md"
	rm -rf "${filePathHistory}"

	dateTo="${line}"

	echo $'\r' >> "${filePathHistory}"
	echo "**Commits:**" >> "${filePathHistory}"

	if [ -z "$dateFrom" ]; then
		git log --oneline --until="${dateTo}" --pretty=format:"* %s" "${branchNameReleaseFrom}" | escapeSomeMarkdownChars >> "${filePathHistory}"
	else
		git log --oneline --since="${dateFrom}" --until="${dateTo}" --pretty=format:"* %s" "${branchNameReleaseFrom}" | escapeSomeMarkdownChars >> "${filePathHistory}"
	fi
	echo $'\r' >> "${filePathHistory}"

	if [ $i == 0 ]; then
		n=`cat ${filePathChangelogTemp} | wc -l`
	else
		n=`sed -n "/\[${tagsArray[i-1]}\]/=" "${filePathChangelogTemp}"`
	fi

	sed -i '' "$(($n - 1))r ${filePathHistory}" "${filePathChangelogTemp}"

	dateFrom="${line}"
	i=$(($i+1))

	rm -rf "${filePathHistory}"
done < "${filePathDates}"

changelogsDiff=`diff "${filePathChangelog}" "${filePathChangelogTemp}"`
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color
if [ -z "$changelogsDiff" ]; then
	echo -e "${RED}Something went wrong while processing CHANGELOG. Kept original generated file.${NC}"
else
	cp "${filePathChangelogTemp}" "${filePathChangelog}"
	echo -e "${GREEN}Commits lists for each release merged into CHANGELOG file. Check it!${NC}"
fi

# Cleanup temp files
rm -rf "${filePathTags}"
rm -rf "${filePathDates}"
rm -rf "${filePathChangelogTemp}"
