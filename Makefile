
rework.js:
	component build --standalone rework --out . --name rework

test:
	@./node_modules/.bin/mocha \
		--require should \
		--reporter spec

.PHONY: test rework.js
