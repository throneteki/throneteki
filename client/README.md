# throneteki-client

The client code for Throneteki, a Web based implementation of A Game of Thrones LCG 2nd Edition

## About

This is the one of the respositories for the code internally known as throneteki which is running on [theironthrone.net](https://theironthrone.net/) allowing people to play AGoT 2nd edition online using only their browser.

Throneteki is split into multiple repositories to make the code more managable. This repository is for the client code.

## Contributing

The code is written in node.js(server) and react.js(client). Feel free to make suggestions, implement new cards, refactor bits of the code that are a bit clunky(there's a few of those atm), raise pull requests or submit bug reports

If you are going to contribute code, try and follow the style of the existing code as much as possible and talk to me before engaging in any big refactors. Also bear in mind there is an .eslintrc file in the project so try to follow those rules. This linting will be enforced in the build checks and pull requests will not be merged if they fail checks.

[Documentation for implementing cards](https://github.com/cryogen/throneteki/blob/master/docs/implementing-cards.md)

## Issues

If you encounter any issues on the site or while playing games, please raise an issue with as much detail as possible.

## Development

These instructions are only needed if you are actively working on the client.

```
git clone https://github.com/throneteki/throneteki-client.git
cd throneteki-client
npm install
npm run start
```

### Coding Guidelines

All JavaScript code included in Throneteki should pass (no errors, no warnings)
linting by [ESLint](http://eslint.org/), according to the rules defined in
`.eslintrc` at the root of this repo. To manually check that that is indeed the
case install ESLint and run

```
npm run lint
```

from repository's root.

### Build Status

[![Travis Build](https://travis-ci.com/throneteki/throneteki-client.svg?branch=master)](https://travis-ci.com/throneteki/throneteki-client)

[<img src="https://i.imgur.com/nueXOvG.png" width="80" height="20">](https://browserstack.com)
