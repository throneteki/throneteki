/*eslint no-console: 0*/

const _ = require('underscore');
const monk = require('monk');

const GameService = require('../services/GameService.js');
const ServiceFactory = require('../services/ServiceFactory.js');

let configService = ServiceFactory.configService();
let db = monk(configService.getValue('dbPath'));
let gameService = new GameService(db);

let args = process.argv.slice(2);

if(_.size(args) === 0) {
    console.info('Running stats on all games');
} else if(_.size(args) === 1) {
    console.info('Running stats on games from ', args[0], ' onwards');
} else if(_.size(args) > 1) {
    console.info('Running stats on games between', args[0], 'and', args[1]);
}

gameService.getAllGames(args[0], args[1]).then(games => {
    let rejected = { singlePlayer: 0, noWinner: 0 };
    console.info('' + _.size(games.filter(game => game.players.some(player => !!player.playtested))), 'total playtesting games');

    let players = {};
    let playtested = {};

    _.each(games, game => {
        if(_.size(game.players) !== 2) {
            rejected.singlePlayer++;

            return;
        }

        if(!game.winner) {
            rejected.noWinner++;

            return;
        }

        _.each(game.players, player => {
            players[player.name] = players[player.name] || { name: player.name, wins: 0, losses: 0 };

            if(player.name === game.winner) {
                players[player.name].wins++;
                let added = [];
                _.each(player.playtested || [], card => {
                    const id = `${card.code}:${card.version}`;
                    if(!added.some(addedId => addedId === id)) {
                        playtested[id] = playtested[id] || { card, winsBy: [], lossesBy: [] };
                        playtested[id].winsBy.push(player.name);
                        added.push(id);
                    }
                });
            } else {
                players[player.name].losses++;
                let added = [];
                _.each(player.playtested || [], card => {
                    const id = `${card.code}:${card.version}`;
                    if(!added.some(addedId => addedId === id)) {
                        playtested[id] = playtested[id] || { card, winsBy: [], lossesBy: [] };
                        playtested[id].lossesBy.push(player.name);
                        added.push(id);
                    }
                });
            }
        });
    });

    let groupCardsBy = groupByFunc => {
        var groups = {};
        _.each(playtested, playtest => {
            var groupBy = groupByFunc(playtest.card);
            var key = JSON.stringify(groupBy);
            groups[key] = groups[key] || { groupBy, cards: [], winsBy: [], lossesBy: [] };
            groups[key].cards.push(playtest.card);
            groups[key].winsBy = groups[key].winsBy.concat(playtest.winsBy);
            groups[key].lossesBy = groups[key].lossesBy.concat(playtest.lossesBy);
        });
        return groups;
    };

    // Win Rates by Name
    let playtestedWinRatesByName = _.map(groupCardsBy(card => ({ name: card.name })), playtest => {
        let wins = playtest.winsBy.length;
        let losses = playtest.lossesBy.length;
        let games = wins + losses;

        return { name: playtest.groupBy.name, wins, losses, winRate: Math.round(wins / games) };
    });

    console.info('### Playtesting Winrate (By Name)\n');
    console.info('Card,Wins,Losses,Win Rate');
    _.each(_.sortBy(playtestedWinRatesByName, 'name'), playtest => {
        console.info(playtest.name, ',', playtest.wins, ',', playtest.losses, ',', playtest.winRate);
    });

    // Win Rates by Name + Version
    let playtestedWinRatesByNameVersion = _.map(groupCardsBy(card => ({ name: card.name, version: card.version })), playtest => {
        let wins = playtest.winsBy.length;
        let losses = playtest.lossesBy.length;
        let games = wins + losses;

        return { name: playtest.groupBy.name, version: playtest.groupBy.version, wins, losses, winRate: Math.round(wins / games) };
    });
    console.info('\n\n');
    console.info('Playtesting Winrate (By Name & Version)\n');
    console.info('Card,Version,Wins,Losses,Win Rate');
    _.each(_.sortBy(playtestedWinRatesByNameVersion, 'name'), playtest => {
        console.info(playtest.name, ',', playtest.version, ',', playtest.wins, ',', playtest.losses, ',', playtest.winRate);
    });

    // Games Played by Name
    let gamesPlayedByName = _.map(groupCardsBy(card => ({ name: card.name })), playtest => {
        let games = playtest.winsBy.length + playtest.lossesBy.length;

        return { name: playtest.groupBy.name, games };
    });
    console.info('\n\n');
    console.info('Top Played Cards\n');
    console.info('Card,Games Played');
    _.each(gamesPlayedByName, playtest => {
        console.info(playtest.name, ',', playtest.games);
    });

    // Games Played by Name + Playtester
    let gamesPlayedByNamePlaytester = _.reduce(players, (all, player) => {
        let playtested = _.map(groupCardsBy(card => ({ name: card.name })), playtest => {
            let wins = playtest.winsBy.filter(playerName => playerName === player.name).length;
            let losses = playtest.lossesBy.filter(playerName => playerName === player.name).length;
            let games = wins + losses;

            return { playtester: player.name, name: playtest.groupBy.name, wins, losses, games };
        }).filter(playtest => playtest.games > 0);

        return all.concat(playtested);
    }, []);
    console.info('\n\n');
    console.info('Top Played Cards (By Playtester)\n');
    console.info('Playtester,Card,Games Played,Wins,Losses');
    _.each(gamesPlayedByNamePlaytester, playtest => {
        console.info(playtest.playtester, ',', playtest.name, ',', playtest.games, ',', playtest.wins, ',', playtest.losses);
    });
})
    .then(() => db.close())
    .catch((ex) => {
        console.log(ex.stack);
        db.close();
    });
