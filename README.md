# Throneteki

Web based implementation of A Game of Thrones LCG 2nd Edition

## About

This is the one of the respositories for the code internally known as throneteki which is running on [theironthrone.net](https://theironthrone.net/) allowing people to play AGoT 2nd edition online using only their browser.

Throneteki is split into multiple repositories to make the code more managable.  This repository is for the lobby server and game node server.

## Contributing

The code is written in node.js(server) and react.js(client).  Feel free to make suggestions, implement new cards, refactor bits of the code that are a bit clunky(there's a few of those atm), raise pull requests or submit bug reports

If you are going to contribute code, try and follow the style of the existing code as much as possible and talk to me before engaging in any big refactors.  Also bear in mind there is an .eslintrc file in the project so try to follow those rules.  This linting will be enforced in the build checks and pull requests will not be merged if they fail checks.

[Documentation for implementing cards](https://github.com/cryogen/throneteki/blob/master/docs/implementing-cards.md)

## Issues
If you encounter any issues on the site or while playing games, please raise an issue with as much detail as possible.

## Development

The game uses [mongodb](https://www.mongodb.com/) as storage so you'll need that installed and running.

If you are not actively developing the client, you will need the client script files in order to connect to your local server.  Please see the instructions in the client repository on how to do this.

```
git clone https://github.com/throneteki/throneteki.git
cd throneteki
git submodule init
git submodule update
npm install
mkdir server/logs
node server/scripts/fetchdata.js
node server/scripts/importstandalonedecks.js
node server/scripts/fetchclient.js
node .
node server/gamenode
```

There are two exectuable components and you'll need to configure/run both to run a local server.  First is the lobby server and then there are game nodes.

For the lobby server, you'll need a file called server/config.js that should look like this:
```javascript
var config = {
  secret: 'somethingverysecret',
  hmacSecret: 'somethingsupersecret',
  dbPath: 'mongodb://127.0.0.1:27017/throneteki',
  mqUrl: 'tcp://127.0.0.1:6000' // This is the host/port of the Zero MQ server which does the node load balancing
};

module.exports = config;
```

For the game nodes you will need a file called server/gamenode/nodeconfig.js that looks like this:

```javascript
var config = {
  secret: 'somethingverysecret', // This needs to match the config above
  mqUrl: 'tcp://127.0.0.1:6000', // This is the host/port of the Zero MQ server which does the node load balancing and needs to match the config above
  socketioPort: 9500, // This is the port for the game node to listen on
  nodeIdentity: 'test1', // This is the identity of the node,
  host: 'localhost'
};

module.exports = config;
```

This will get you up and running in development mode.

For production:

```
NODE_ENV=production PORT=4000 node .
```

Then for each game node (typically one per CPU/core):

```
PORT={port} SERVER={node-name} node server/gamenode
```

### Coding Guidelines

All JavaScript code included in Throneteki should pass (no errors, no warnings)
linting by [ESLint](http://eslint.org/), according to the rules defined in
`.eslintrc` at the root of this repo. To manually check that that is indeed the
case install ESLint and run

```
eslint client/ server/ test/
```

from repository's root.

All tests should also pass.  To run these manually do:

```
npm test
```

If you are making any game engine changes, these will not be accepted without unit tests to cover them.

### Build Status

[![Travis Build](https://travis-ci.com/throneteki/throneteki.svg?branch=master)](https://travis-ci.com/throneteki/throneteki)
