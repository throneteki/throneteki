/*eslint no-console: 0*/

const fs = require('fs');
const _ = require('underscore');
const monk = require('monk');

const GameService = require('../services/GameService.js');
const ServiceFactory = require('../services/ServiceFactory.js');

let configService = ServiceFactory.configService();
let db = monk(configService.getValue('dbPath'));
let gameService = new GameService(db);

const from = getArg('from');
const to = getArg('to');
const format = getArg('format', 'console');

console.info(
    'Running stats on games from',
    from ? from : 'the beginning of time',
    'to',
    to ? to : 'the end of time',
    '.'
);
console.info('Writing to', format, '...');

gameService
    .getAllGames(from, to)
    .then((games) => {
        console.info(
            '' + _.size(games.filter((game) => game.players.some((player) => !!player.playtested))),
            'total playtesting games'
        );

        let rejected = { singlePlayer: 0, noWinner: 0 };
        let players = {};
        let playtested = {};

        _.each(games, (game) => {
            if (_.size(game.players) !== 2) {
                rejected.singlePlayer++;

                return;
            }

            if (!game.winner) {
                rejected.noWinner++;

                return;
            }

            _.each(game.players, (player) => {
                players[player.name] = players[player.name] || {
                    name: player.name,
                    wins: 0,
                    losses: 0
                };

                if (player.name === game.winner) {
                    players[player.name].wins++;
                    let added = [];
                    _.each(player.playtested || [], (card) => {
                        const id = `${card.code}:${card.version}`;
                        if (!added.some((addedId) => addedId === id)) {
                            playtested[id] = playtested[id] || { card, winsBy: [], lossesBy: [] };
                            playtested[id].winsBy.push(player.name);
                            added.push(id);
                        }
                    });
                } else {
                    players[player.name].losses++;
                    let added = [];
                    _.each(player.playtested || [], (card) => {
                        const id = `${card.code}:${card.version}`;
                        if (!added.some((addedId) => addedId === id)) {
                            playtested[id] = playtested[id] || { card, winsBy: [], lossesBy: [] };
                            playtested[id].lossesBy.push(player.name);
                            added.push(id);
                        }
                    });
                }
            });
        });

        let groupCardsBy = (groupByFunc) => {
            var groups = {};
            _.each(playtested, (playtest) => {
                var groupBy = groupByFunc(playtest.card);
                var key = JSON.stringify(groupBy);
                groups[key] = groups[key] || { groupBy, cards: [], winsBy: [], lossesBy: [] };
                groups[key].cards.push(playtest.card);
                groups[key].winsBy = groups[key].winsBy.concat(playtest.winsBy);
                groups[key].lossesBy = groups[key].lossesBy.concat(playtest.lossesBy);
            });
            return groups;
        };

        const resultMap = new Map();
        let title = '';
        let rows = [];
        let dataSet = [];

        ///////////////////////
        // Win Rates by Name //
        ///////////////////////

        title = 'Playtesting Winrate (By Name)';
        rows = [['Card', 'Wins', 'Losses', 'Win Rate']];
        dataSet = _.map(
            groupCardsBy((card) => ({ name: card.name })),
            (playtest) => {
                let wins = playtest.winsBy.length;
                let losses = playtest.lossesBy.length;
                let games = wins + losses;

                return {
                    name: playtest.groupBy.name,
                    wins,
                    losses,
                    winRate: Number((wins / games).toFixed(2))
                };
            }
        );
        _.each(_.sortBy(dataSet, 'winRate').reverse(), (playtest) => {
            rows.push([playtest.name, playtest.wins, playtest.losses, playtest.winRate]);
        });
        resultMap.set(title, rows);

        /////////////////////////////////
        // Win Rates by Name + Version //
        /////////////////////////////////

        title = 'Playtesting Winrate (By Name & Version)';
        rows = [['Card', 'Version', 'Wins', 'Losses', 'Win Rate']];
        dataSet = _.map(
            groupCardsBy((card) => ({ name: card.name, version: card.version })),
            (playtest) => {
                let wins = playtest.winsBy.length;
                let losses = playtest.lossesBy.length;
                let games = wins + losses;

                return {
                    name: playtest.groupBy.name,
                    version: playtest.groupBy.version,
                    wins,
                    losses,
                    winRate: Number((wins / games).toFixed(2))
                };
            }
        );
        _.each(_.sortBy(dataSet, 'winRate').reverse(), (playtest) => {
            rows.push([
                playtest.name,
                playtest.version,
                playtest.wins,
                playtest.losses,
                playtest.winRate
            ]);
        });
        resultMap.set(title, rows);

        //////////////////////////
        // Games Played by Name //
        //////////////////////////
        title = 'Top Played Cards';
        rows = [['Card', 'Games Played']];
        dataSet = _.map(
            groupCardsBy((card) => ({ name: card.name })),
            (playtest) => {
                let games = playtest.winsBy.length + playtest.lossesBy.length;

                return { name: playtest.groupBy.name, games };
            }
        );
        _.each(_.sortBy(dataSet, 'games').reverse(), (playtest) => {
            rows.push([playtest.name, playtest.games]);
        });
        resultMap.set(title, rows);

        ///////////////////////////////////////
        // Games Played by Name + Playtester //
        ///////////////////////////////////////
        title = 'Top Played Cards (By Playtester)';
        rows = [['Playtester', 'Card', 'Wins', 'Losses', 'Win Rate']];
        dataSet = _.reduce(
            players,
            (all, player) => {
                let playtested = _.map(
                    groupCardsBy((card) => ({ name: card.name })),
                    (playtest) => {
                        let wins = playtest.winsBy.filter(
                            (playerName) => playerName === player.name
                        ).length;
                        let losses = playtest.lossesBy.filter(
                            (playerName) => playerName === player.name
                        ).length;
                        let games = wins + losses;

                        return {
                            playtester: player.name,
                            name: playtest.groupBy.name,
                            wins,
                            losses,
                            winRate: Number((wins / games).toFixed(2))
                        };
                    }
                ).filter((playtest) => playtest.wins + playtest.losses > 0);

                return all.concat(playtested);
            },
            []
        );
        _.each(_.sortBy(dataSet, 'winRate').reverse(), (playtest) => {
            rows.push([
                playtest.playtester,
                playtest.name,
                playtest.wins,
                playtest.losses,
                playtest.winRate
            ]);
        });
        resultMap.set(title, rows);

        /////////////////////
        // All Usable Data //
        /////////////////////
        title = 'All Data';
        rows = [['Playtester', 'Card', 'Version', 'Faction', 'Wins', 'Losses']];
        dataSet = _.reduce(
            players,
            (all, player) => {
                let playtested = _.map(
                    groupCardsBy((card) => ({
                        name: card.name,
                        version: card.version,
                        faction: card.faction
                    })),
                    (playtest) => {
                        let wins = playtest.winsBy.filter(
                            (playerName) => playerName === player.name
                        ).length;
                        let losses = playtest.lossesBy.filter(
                            (playerName) => playerName === player.name
                        ).length;
                        let games = wins + losses;

                        return {
                            playtester: player.name,
                            name: playtest.groupBy.name,
                            version: playtest.groupBy.version,
                            faction: playtest.groupBy.faction,
                            wins,
                            losses,
                            winRate: Number((wins / games).toFixed(2))
                        };
                    }
                ).filter((playtest) => playtest.wins + playtest.losses > 0);

                return all.concat(playtested);
            },
            []
        );
        _.each(_.sortBy(dataSet, 'card').reverse(), (playtest) => {
            rows.push([
                playtest.playtester,
                playtest.name,
                playtest.version,
                playtest.faction,
                playtest.wins,
                playtest.losses
            ]);
        });
        resultMap.set(title, rows);

        for (const [title, rows] of resultMap) {
            switch (format) {
                case 'console': {
                    console.log('\n' + title);
                    const headers = rows[0];
                    const tableData = rows.slice(1).map((row) => {
                        let obj = {};
                        for (const index in headers) {
                            obj[headers[index]] = row[index];
                        }
                        return obj;
                    });
                    console.table(tableData);
                    break;
                }
                case 'csv': {
                    try {
                        const filePath = __dirname + '/' + title.replace(/\s/g, '_') + '.csv';
                        let content = '';
                        for (const row of rows) {
                            content += row.join(',') + '\n';
                        }
                        fs.writeFileSync(filePath, content, { flag: 'w+' });
                        console.log('Successfully written to ' + filePath + '!');
                    } catch (err) {
                        console.error(err);
                    }
                    break;
                }
            }
        }
    })
    .then(() => db.close())
    .catch((ex) => {
        console.log(ex.stack);
        db.close();
    });

function getArg(name, defaultVal = undefined) {
    const argIndex = process.argv.indexOf('--' + name);
    let value = defaultVal;
    if (argIndex > -1) {
        if (process.argv.length <= argIndex + 1) {
            throw 'Failed to process args: must provide value for "--' + name + '".';
        }
        value = process.argv[argIndex + 1];
    }
    return value;
}
