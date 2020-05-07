#!/bin/bash

function escapeSomeMarkdownChars {
	sed 's/\* \*/*/' | sed 's/\* \+/*/'
}

BASEDIR=$(dirname $0)
branchNameReleaseFrom=dev
commitsListHeading=Commits

# Set files paths
filePathTags="${BASEDIR}/../temp/tags.txt"
filePathDates="${BASEDIR}/../temp/tags-dates.txt"
filePathChangelog="${BASEDIR}/../CHANGELOG.md"
filePathChangelogTemp="${BASEDIR}/../CHANGELOG-TEMP.md"

# Generate "raw" changelog file
github_changelog_generator
changelogContent=`cat $filePathChangelog`

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
# (but only if there isn't any other info)
i=0
dateFrom=
while read line; do
	filePathHistory="${BASEDIR}/../temp/${tagsArray[i]}.md"
	rm -rf "${filePathHistory}"

	dateTo="${line}"

	echo $'\r' >> "${filePathHistory}"
	echo "**$commitsListHeading:**" >> "${filePathHistory}"

	if [ -z "$dateFrom" ]; then
		git log --oneline --until="${dateTo}" --pretty=format:"* %s" "${branchNameReleaseFrom}" | grep -v 'Merge' | escapeSomeMarkdownChars >> "${filePathHistory}"
	else
		git log --oneline --since="${dateFrom}" --until="${dateTo}" --pretty=format:"* %s" "${branchNameReleaseFrom}" | grep -v 'Merge' | escapeSomeMarkdownChars >> "${filePathHistory}"
	fi
	echo $'\r' >> "${filePathHistory}"

	if [ $i == 0 ]; then
		n=`cat ${filePathChangelogTemp} | wc -l`
	else
		n=`sed -n "/\[${tagsArray[i-1]}\]/=" "${filePathChangelogTemp}"`
	fi

	# Check for some existing info
	shouldInsertCommitsInfo=false
	re="\[${tagsArray[i]}\].+"
	if [[ $i > 0 ]]; then
		re+="\[${tagsArray[i-1]}\]"
	fi
	if [[ $changelogContent =~ $re ]]; then
		someInfo=`echo ${BASH_REMATCH[0]} | grep -e $commitsListHeading -e 'Security fixes' -e 'Unreleased' -e 'Removed' -e 'Deprecated' -e 'Fixed bugs' -e 'Implemented enhancements' -e 'Breaking changes' -e 'Closed issues' -e 'Merged pull requests' | grep ':'`
		if [ -z "$someInfo" ]; then
			shouldInsertCommitsInfo=true
		fi
	fi

	# Insert commits list if no other info exists
	if [ "$shouldInsertCommitsInfo" = true ]; then
		sed -i '' "$(($n - 1))r ${filePathHistory}" "${filePathChangelogTemp}"
	fi

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
