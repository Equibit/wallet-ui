build:
	-rm -rf dist
	node build

release-qa:
	git checkout -b qa1
	git add -f dist
	git commit -m "QA build"
	git push -f origin qa1
	git checkout -
	git branch -D qa1
	git push
	git push --tags

publish-docs:
	npm install
	git checkout -b gh-pages
	npm run document
	git add -f docs/
	git add -f node_modules/can-*
	git add -f node_modules/steal
	git add -f node_modules/steal-*
	git add -f node_modules/done-component
	git commit -m "Publish docs"
	git push -f origin gh-pages
	git rm -q -r --cached node_modules
	git checkout -
	git branch -D gh-pages

