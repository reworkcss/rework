NODE_BIN=node_modules/.bin
MOCHA=$(NODE_BIN)/mocha
COMPONENT=$(NODE_BIN)/component

rework.js:
	@$(COMPONENT) install
	@$(COMPONENT) build --standalone rework --out . --name rework

test:
	@$(MOCHA) --require should

clean:
	rm -f rework.js
	rm -fr components

.PHONY: test rework.js clean
