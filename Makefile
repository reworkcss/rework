
rework.js:
	@component install
	@component build --standalone rework --out . --name rework

test:
	@./node_modules/.bin/mocha \
		--require should

.PHONY: test rework.js
