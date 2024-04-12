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

### Prerequisites
- Git
- Node.js 16.x
- Mongodb 4.0 or higher *
- Redis 7.2.x or higher *
- Windows, macOS, or Linux operating system

_* Not required if running/debugging through Docker_
### Recommendations
- Visual Studio Code
- Docker Desktop

### Installation (Windows)
#### 1. Clone the repository:
It is recommended to fork this repository first, and develop through that fork - if you do, simply clone from your fork instead of this repository.
```
git clone https://github.com/throneteki/throneteki.git
cd throneteki
```
_From this point onwards, assume all commands are being run from the above throneteki folder._
#### 2. Initialise the submodule:
The [throneteki-json-data](https://github.com/throneteki/throneteki-json-data) submodule contains all official game data (eg. cards, packs) and is shared with other repositories. If you with to contribute to updating this data, please visit that repository as well.
```
git submodule init
git submodule update
```
#### 3. Install node packages:
```
npm install
```
#### 4. Fetch data & images:
The `fetchdata.js` script is responsible for caching the latest data from the throneteki-json-data submodule, and will need to be re-run when that repository is updated (to fetch the latest updates).
```
mkdir server\logs
node server\scripts\fetchdata.js
node server\scripts\importstandalonedecks.js
```

#### 5. Create local config file:
Copying from the `default.json5` file should set you up to debug using Docker, however some changes are required for other debugging methods; these edits will be mentioned in their respective sections below.
```
copy config\default.json5 config\local.json5
```

### Debugging (Windows)
There are multiple options for running your changes locally, primarily through **Docker**, through **VS Code**, or via your preferred **terminal**.

#### Docker
Running through Docker has the benefit of being extremely easy to start up, and if done through Visual Studio Code, is quite easy to debug. You can start a docker container through the **Docker Launch** configuration. Whilst that docker container is running, you will need to fetch data at least once; this can be done through the **Fetch Data (Docker)** task, and should be re-done each time the throneteki-json-data repository is updated.

Alternatively, you can create everything you need in your preferred terminal instead. To start, you will need to create an external docker volume named "throneteki_mongodb", which will allow your database to remain persistent throughout multiple debug sessions, and only needs to be run once:
```
docker volume create throneteki_mongodb
```
Next, you will need to compile a compose container using our development compose file. This will contain our client/lobby and node applications, plus other relevant services needed to run throneteki:
```
docker compose --file "./docker-compose.yml" --file "./docker-compose.dev.yml" up --detach --build
```
You can now access the application at **http://localhost:4000/**, however you will need to run the data fetching scripts within that container. `importstandalonedecks.js` only needs to be run once, and `fetchdata.js` should be run each time the throneteki-json-data repository is updated:
```
docker exec -it throneteki-lobby-1 node server\scripts\fetchdata.js
docker exec -it throneteki-lobby-1 node server\scripts\importstandalonedecks.js
```

To shut off your container, and if you wish to dispose of all unnecessary containers, images & temporary volumes, you can run the following compose down command to clean things up:
```
docker compose --file ".\docker-compose.yml" --file ".\docker-compose.dev.yml" down --rmi "local" --volumes
```

Whether you run your docker container through VS Code configurations, or through your terminal, you can debug your lobby & game node through the attach configurations **Docker Attach (Lobby)** and **Docker Attach (Game)**.

#### Visual Studio Code
Running directly through Visual Studio Code has the benefit of being quick & easy to debug, but does require you to set up & run  MongoDB & Redis separately, and to update your `local.json5` config to point toward those running service ports:
```
    dbPath: 'mongodb://localhost:{mongo port}/throneteki',
    ...
    redisUrl: "redis://localhost:{redis port}/",
```
After you have both services running, you can debug your lobby with the **Launch (Lobby)** configuration, and your game server with the **Launch (Game)** configuration. Additionally, you can debug the client through the **Launch (Client)** configuration. There is also the **Fetch Data (Local)** task to fetch updates to your database.

#### Terminal
Running through terminal has the benefits of being as light-weight as possible, but does come at the cost of complexity & requires additional tools to debug. Similar to the above, it will require you to set up & run MongoDB & Redis separately, and update your `local.json5` config to point to those running service ports:
```
    dbPath: 'mongodb://localhost:{mongo port}/throneteki',
    ...
    redisUrl: "redis://localhost:{redis port}/",
```
Additionally, it will require you to set some environmental variables before running each process. Below will outline the series of commands required for each process, using windows (other operating systems will require alternate methods of setting env variables).

Client & Lobby Server
```
SET NODE_ENV=development
SET NODE_CONFIG_DIR=config
SET PORT=4000
node .
```
Game Server
```
SET NODE_ENV=development
SET NODE_CONFIG_DIR=config
SET PORT=9500
SET SERVER=node1
node server/gamenode
```
_You can start additional game servers if you wish, as long as the PORT & SERVER values are unique!_

Access your application at **http://localhost:4000/**.

### Documentation
> **TODO: Add description; Ensure documentation is up to date; Maybe ensure unit test has a guide?**

> [Documentation for implementing cards](https://github.com/throneteki/throneteki/blob/master/docs/implementing-cards.md)

### Coding Guidelines

All code included in Throneteki should pass (no errors, no warnings) linting by [ESLint](http://eslint.org/), according to the rules defined in `.eslintrc` at the root of this repository. There is an [ESLint extention](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) for Visual Studio Code for live linting or you can, if you have ESLint installed, run checks manuallyhe following will install ESLint globally:
```
npm -g i eslint-cli
```
And the following will run the eslint test in appropriate directories:
```
eslint server/ test/
```
There are also various unit tests created using [Jasmine](https://jasmine.github.io/) which need to pass without errors or warnings. Within Visual Studio Code, you can run & debug these tests through the **Debug Tests** launch configuration; otherwise, you can run it locally using:
```
npm test
```
Please note that if you are implementing any game engine changes, they will not be accepted without appropriate unit tests to cover them. If you wish to understand how to create unit tests, the Jasmine website has suiteable documentation, and existing tests can be used as guides.
