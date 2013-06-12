
rework.js:
	@component install
	@component build --standalone rework --out . --name rework

test:
	@./node_modules/.bin/mocha \
		--require should

clean:
	rm -f rework.js
	rm -fr components

.PHONY: test rework.js clean
