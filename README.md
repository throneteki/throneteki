# Throneteki

A web based implementation of A Game of Thrones LCG 2nd Edition.

## About

This is the one of the respositories for the code internally known as throneteki which is running on [theironthrone.net](https://theironthrone.net/) allowing people to play AGoT 2nd edition online using only their browser.

Throneteki is split into two repositories:
- throneteki (this): contains changes for the client, lobby server, and game node server.
- [throneteki-json-data](https://github.com/throneteki/throneteki-json-data): contains changes for official data for the AGoT 2nd edition card game, and is usable by other websites (such as [ThronesDB](https://thronesdb.com/)).

## Issues

If you encounter any issues on the site or while playing games, please raise an issue with as much detail as possible.
> **TODO: Add more detail; Discord link(s); Maybe set up Github Issue templates?**

## Contributing

The code is written in node.js (server) and react.js (client). Feel free to make suggestions, implement new cards, refactor bits of the code that are a bit clunky (there's a few of those atm), raise pull requests or submit bug reports.

If you are going to contribute code, try and follow the style of the existing code as much as possible and talk to @Cryogen before engaging in any big refactors. Following linting guidelinges (see `.eslintrc` file) and unit tests (via `Jasmine`) are a requirement for contributing and will be enforced for all pull requests; pull requests with failed checks will not be merged.

If you require any assistance, we recommend joining [TheIronThrone development discord server](https://discord.gg/y9xSAZqVRu); it is generally the best place to discuss contributing, and to get direct help from top contributors.

## Development

### Docker (Dev Container)
#### Required Software:
- Docker
- Visual Studio Code

If you have docker installed & use VS Code, you can utilize [Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers) for development.

Clone the repository, open in VS Code, [install the Dev Containers extension](vscode:extension/ms-vscode-remote.remote-containers) and click the "Remote Status" icon in the bottom left. Choosing to **Reopen in Container** will initialise & open your dev container, and you should be able to jump straight into debugging after initialisation completes.

### ~~Docker (CLI)~~ _Not Implemented Yet_
#### Required Software:
- Docker

Clone your reposity, then run the following commands:
```
git submodule update --init
npm install
docker volume create throneteki_db
docker compose --file "./docker-compose.yml" --file "./docker-compose.dev.yml" up --detach --build
```
In another terminal, run the following commands:
```
docker exec -it throneteki-lobby-1 node server\scripts\fetchdata.js
docker exec -it throneteki-lobby-1 node server\scripts\importstandalonedecks.js
```
If you would like to cleanly stop & dispose of your container(s), run the following command:
```
docker compose --file ".\docker-compose.yml" --file ".\docker-compose.dev.yml" down --rmi "local" --volumes
```

### Non-Docker
#### Required Software:
- Git
- Node.js 16.x
- MongoDB 4.0 or higher
- Redis 7.2.x or higher

Clone the repository, then run the following commands:
```
git submodule update --init
npm install
```
Create `config/local.json5` by copying `config/default.json5` and change the following values, ensuring that `{MONGODB_PORT}` & `{REDIS_PORT}` are your configured ports for those services:
```
    dbPath: 'mongodb://localhost:{MONGODB_PORT}/throneteki',
    ...
    redisUrl: "redis://localhost:{REDIS_PORT}/",
```
Run the following commands to fetch data:
```
node server\scripts\fetchdata.js
node server\scripts\importstandalonedecks.js
```

Run the following command to start the lobby:
```
NODE_ENV=development PORT=4000 node .
```
Run the following command to start a gamenode:
```
PORT=5000 SERVER=node1 node server\gamenode
```
Note that non-linux operating systems will need to set the environmental variables (such as `PORT`) differently.

### Running & Testing
The website should be accessible by browsing to [localhost:4000](http://localhost:4000/).

On first start, you will need to create yourself an account, and a second one if you need to test against an opponent. Any emails in development can be fake. In order to test against yourself, you will need to open at least one browser incognito.

There are unit tests using [Jasmine](https://jasmine.github.io/) which need to pass without errors or warnings. Run the following to perform tests locally before committing:
```
npm test
```
If you are implementing any game engine changes, they will not be accepted without appropriate unit tests to cover them. If you wish to understand how to create unit tests, the Jasmine website has suiteable documentation, and existing tests can be used as guides.

### Coding Guidelines

Throneteki uses [ESLint](http://eslint.org/) for lint tests, and should pass without error or warning for approval. Extensions exist (eg. [ESLint extention](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) for VS Code), otherwise run the following to install ESLint globally:
```
npm -g i eslint-cli
```
And the following to test the appropriate directories:
```
eslint server/ test/
```


### Documentation
> **TODO: Add description; Ensure documentation is up to date; Maybe ensure unit test has a guide?**

> [Documentation for implementing cards](https://github.com/throneteki/throneteki/blob/master/docs/implementing-cards.md)