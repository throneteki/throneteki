# Throneteki

A web based implementation of A Game of Thrones LCG 2nd Edition.

## About

This is the one of the respositories for the code internally known as throneteki which is running on [theironthrone.net](https://theironthrone.net/) allowing people to play AGoT 2nd edition online using only their browser.

Throneteki is split into two repositories:
- [throneteki](https://github.com/throneteki/throneteki) (this) contains changes for the client, lobby server, and game node server.
- [throneteki-json-data](https://github.com/throneteki/throneteki-json-data) contains changes for official data for the AGoT 2nd edition card game, and is usable by other websites (such as [ThronesDB](https://thronesdb.com/)).

## Issues

If you encounter any issues on the site or while playing games, please [submit an issue](https://github.com/throneteki/throneteki/issues) with as much detail as possible; try to provide what happened, if you can reproduce it & how, what cards were involved, what the last action was that was made.

## Contributing
Throneteki is written in node.js (server) and react.js (client). Feel free to make suggestions, implement new cards, refactor bits of the code that aren't behaving properly, raise pull requests or submit bug reports.

We appreicate all who are willing to contribute code to this project; the [card implementation guide](https://github.com/throneteki/throneteki/blob/master/docs/implementing-cards.md) should prove useful in understanding how to implement new cards or how existing ones work. For additional questions or queries, our [development discord server](https://discord.gg/y9xSAZqVRu) is a useful place to find help.

Following linting guidelines and passing unit tests is a requirement for contributing, with more details on how to do so in "Testing" below. Both will be enforces on all pull requests; those with failed checks will not be merged.

If you have any major changes you'd like to implement, we would recommend mentioning this within our discord first to ensure it aligns with the websites intent.

## Development

### Installation
Fork the main repository onto your GitHub account. Next, clone your forked repository.
Then run the following commands in your repo folder:
```
git submodule update --init
npm install
```
This installs the `throneteki-json-data` submodule within your project, which stores all of the
card data.

### Docker (Dev Container)
#### Required Software:
- Docker
- Visual Studio Code

If you have docker installed & use VS Code, you can utilize [Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers) for development.

Open the repository in VS Code, [install the Dev Containers extension](vscode:extension/ms-vscode-remote.remote-containers) and click the "Remote Status" icon in the bottom left. Choosing to **Reopen in Container** will initialise & open your dev container, and you should be able to jump straight into debugging after initialisation completes.

If you need to re-compile your container (eg. after an update involving dev-containers), simply choose **Rebuild Container** on the Remote Status menu whilst in your dev-container.

Run and Debug configurations are available to debug the client, lobby & game node, and there are tasks available to run individual components (such as client & lobby) without debugging, or for useful scripts (such as fetching data).

### Non-Docker
#### Required Software:
- Git
- Node.js 20.x
- MongoDB 4.0 or higher
- Redis 7.2.x or higher

Create `config/local.json5` by copying `config/default.json5` and change the following values to match your configured mongodb & redis ports:
```
dbPath: 'mongodb://localhost:{MONGODB_PORT}/throneteki',
```
```
redisUrl: "redis://localhost:{REDIS_PORT}/",
```
Run the following commands to fetch data:
```
node server\scripts\fetchdata.js
node server\scripts\importstandalonedecks.js
```

### Running
Run the following command in a terminal window to start the lobby & client *:
```
NODE_ENV=development PORT=4000 node .
```
Run the following command in another terminal window to start a gamenode *:
```
PORT=4050 SERVER=node1 node server/gamenode
```

*_Note that non-linux operating systems will need to set the environmental variables (such as `PORT`) differently._
Once the lobby is running, it should be accessible by browsing to [localhost:4000](http://localhost:4000/).

On first start, you will need to create yourself an account, and a second one if you need to test against an opponent. Any emails in development can be fake, and in order to test against yourself, you will need to open at least one browser incognito.

If there are any changes to card data, make sure your `throneteki-json-data` submodule is up to date, and make sure to run the fetch data scripts again.

### Testing
Throneteki uses [ESLint](http://eslint.org/) for lint tests, and should pass without error or warning for approval. Extensions exist to help with this (eg. [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) for VS Code), otherwise run the following to install ESLint globally:
```
npm -g i eslint-cli
```
And the following to test the appropriate directories:
```
eslint server/ test/
```
Unit tests are conducted using [Jasmine](https://jasmine.github.io/), and must pass without errors or warnings to be accepted. Run the following to perform tests locally before committing:
```
npm test
```
If you are implementing any game engine changes, they will not be accepted without appropriate unit tests to cover them. If you wish to understand how to create unit tests, the Jasmine website has suiteable documentation, and existing tests can be used as guides. Additionally, we would also encourage updating the [card implementation guide](https://github.com/throneteki/throneteki/blob/master/docs/implementing-cards.md) if your changes affect any details within that document.