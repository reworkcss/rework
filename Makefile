rework.js:
	component install
	component build --standalone rework --out . --name rework

test:
	@./node_modules/.bin/mocha \
		--require should \
		--reporter spec

.PHONY: rework.js test
