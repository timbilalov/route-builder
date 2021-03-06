# Changelog

## [v0.3.6](https://github.com/timbilalov/route-builder/tree/v0.3.6) (2020-08-16)

[Full Changelog](https://github.com/timbilalov/route-builder/compare/v0.3.5...v0.3.6)


**Commits:**
* Fixed some github_changelog_generator warnings about PR (#19)

## [v0.3.5](https://github.com/timbilalov/route-builder/tree/v0.3.5) (2020-05-07)

[Full Changelog](https://github.com/timbilalov/route-builder/compare/v0.3.4...v0.3.5)

**Implemented enhancements:**

- Add commits list to changelog only if there are no other info [\#13](https://github.com/timbilalov/route-builder/issues/13)

## [v0.3.4](https://github.com/timbilalov/route-builder/tree/v0.3.4) (2020-05-06)

[Full Changelog](https://github.com/timbilalov/route-builder/compare/v0.3.3...v0.3.4)

**Implemented enhancements:**

- Exclude PR merge-commits from changelog [\#11](https://github.com/timbilalov/route-builder/issues/11)
- Add link to changelog in README.md [\#9](https://github.com/timbilalov/route-builder/issues/9)

## [v0.3.3](https://github.com/timbilalov/route-builder/tree/v0.3.3) (2020-05-05)

[Full Changelog](https://github.com/timbilalov/route-builder/compare/v0.3.2...v0.3.3)


**Commits:**
* Cleanup 'files-to-delete' temp file during release script

## [v0.3.2](https://github.com/timbilalov/route-builder/tree/v0.3.2) (2020-05-05)

[Full Changelog](https://github.com/timbilalov/route-builder/compare/v0.3.1...v0.3.2)


**Commits:**
* Exclude merge-commits from changelog

## [v0.3.1](https://github.com/timbilalov/route-builder/tree/v0.3.1) (2020-05-05)

[Full Changelog](https://github.com/timbilalov/route-builder/compare/v0.3.0...v0.3.1)


**Commits:**
* Versioning and changelog generating, part 6
* Versioning and changelog generating, part 5
* Versioning and changelog generating, part 4
* Versioning and changelog generating, part 3
* Versioning and changelog generating, part 2
* Versioning and changelog generating, part 1
* Fixed situation, when completed segments remains completed even if addresses have changed

## [v0.3.0](https://github.com/timbilalov/route-builder/tree/v0.3.0) (2020-04-26)

[Full Changelog](https://github.com/timbilalov/route-builder/compare/v0.2.1...v0.3.0)


**Commits:**
* New feature: export/import stages data by url
* Some look and feel changes
* New feature: move entered addresses
* Fixed bug with empty value for address field
* New feature: completed/uncompleted route segments
* Visual improvements, chunk 2.
* Visual improvements, chunk 1.

## [v0.2.1](https://github.com/timbilalov/route-builder/tree/v0.2.1) (2020-04-19)

[Full Changelog](https://github.com/timbilalov/route-builder/compare/v0.2.0...v0.2.1)


**Commits:**
* Hotfix: publicPath for worker file

## [v0.2.0](https://github.com/timbilalov/route-builder/tree/v0.2.0) (2020-04-19)

[Full Changelog](https://github.com/timbilalov/route-builder/compare/v0.1.0...v0.2.0)


**Commits:**
* Little UI updates for mobile
* Warning of max points for calc by min distance
* Loading state for map (case with "heavy" calcs)
* Code cleanup
* Simple (and not ideal) cache mechanics for map "heavy" sort calcs.
* Implemented WebWorker, for better UX. Now permutations and other "heavy" calcs can be done in background. Also, some calcs became faster.
* Fixed bad calc for Heap's algorithm. Now it works as expected.
* Correct mechanics and better UI for stages selection
* City selection implemented
* Fixed bug with permutations calc
* Game stages implemented
* Some files converted from .sass to .scss — for better Emmet featuring in WebStorm
* Clean up and audit fix for package.json
* Implemented a new route calculation variant by minimal total distance (finding all possible route permutations based on Heap's algorithm). Also added selector to change calc variant "on a fly".
* Field blocks better look
* Show recognition errors

## [v0.1.0](https://github.com/timbilalov/route-builder/tree/v0.1.0) (2020-04-05)

[Full Changelog](https://github.com/timbilalov/route-builder/compare/57dcb9fdb922d4a5cf557cc67fedae14ed6c35fa...v0.1.0)




**Commits:**
* Voice input pretty look
* Code cleanup
* Refactoring, part 6
* build
* Refactoring, part 5
* Refactoring, part 4
* Refactoring, part 3
* Redux store implemented
* Refactoring, part 2
* Refactoring, part 1
* "Clear inputs" feature
* Debouncing for inputs change
* Map component
* Remove address by button click
* Root component
* hotfix: React import in index.js
* React packages added and first components integrated
* some basic UI improvements, like waypoints named and ordered
* build
* navigation for each route segment (path) + saved values (localStorage)
* pseudo-continuous recognition + another variant of link to external maps (but not app)
* trying to set recognition.continuous to false
* dist/ → docs/
* TEMP: VoiceInput2 disabled
* dist command and folder -- to make github-pages work TEMP: VoiceInput2 -- to check some recognition errors
* voice input -- chunk #1
* grab adresses from text inputs * build mechanism updated + link to external app
* first attempt to sort points created by text address
* Yandex.Map example
* readme * index page cleanup
* initial commit -- cloned from SP.Starter

\* *This Changelog was automatically generated by [github_changelog_generator](https://github.com/github-changelog-generator/github-changelog-generator)*
