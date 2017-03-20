# Throneteki

Web based implementation of A Game Of Thrones LCG 2nd Edition

## FAQ

### What is it?

This is the respository for the code internally known as throneteki which is running on [theironthrone.net](https://theironthrone.net/) allowing people to play AGoT 2nd edition online using only their browser

### Does't this look a lot like Jinteki? The Android netrunner online experience?

Glad you noticed!  Yes, jinteki was a huge inspiration for this project, as the interface is clean and user friendly, so I've tried to make this similar in a lot of ways

### Can I contribute?

Sure!  The code is written in node.js(server) and react.js(client).  Feel free to make suggestions, implement new cards, refactor bits of the code that are a bit clunky(there's a few of those atm), raise pull requests or submit bug reports

If you are going to contribute code, try and follow the style of the existing code as much as possible and talk to me before engaging in any big refactors.  Also bear in mind there is an .eslintrc file in the project so try to follow those rules.

[Documentation for implementing cards](https://github.com/cryogen/throneteki/blob/master/docs/implementing-cards.md)

The biggest help at the moment would be in terms of CSS, as that's a bit of a weakness of mine, feel free to pick up any of the issues tagged 'CSS' in the issue list.

If you're not coding inclined, then just playing games on the site, and reporting bugs and issues that you find is a big help

### X Y Z doesn't work
That's not a question, but that still sucks, sorry :(  First, bear in mind the site is in its infancy so a lot of things aren't implemented yet, but you should be able to do most things with a bit of manual input.  If there's anything you can't do that you need to be able to do, let me know by raising an issue.

See this document for features I have planned and a link to the currently implemented cards:  http://bit.ly/throneteki

### How do I do X Y Z?

Check out the [About page](https://theironthrone.net/about) of a Throneteki live deployment.

## Development

The game uses mongodb as storage so you'll need that installed and running.

```
Clone the repository
git submodule init
git submodule update
Run npm install
mkdir server/logs
cd server
node fetchdata.js
cd ..
./node_nodules/.bin/webpack --config webpack.config.js
node .
node server
```

If you make changes to the client code you will need to rerun this:
```
./node_nodules/.bin/webpack --config webpack.config.js
```

There are two exectuable components and you'll need to configure/run both to run a local server.  First is the lobby server and then there are game nodes.

For the lobby server, you'll need a file called server/config.js that should look like this:
```javascript
var config = {
  secret: 'somethingverysecret',
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
NODE_ENV=production ./node_nodules/.bin/webpack -p --config webpack.config.production.js
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

[![CircleCI](https://circleci.com/gh/cryogen/throneteki.svg?style=svg)](https://circleci.com/gh/cryogen/throneteki)
[![Travis Build](https://travis-ci.org/cryogen/throneteki.svg?branch=master)](https://travis-ci.org/cryogen/throneteki)
