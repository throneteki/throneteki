/*
 * Runs a scenario game on a game node for local development. Started by the game node when the
 * SCENARIO environment variable is set (see docs/testing-cards.md). The game is rebuilt in place
 * whenever the spec file changes.
 */

import fs from 'fs';
import { randomUUID } from 'crypto';
import logger from '../../log.js';
import Settings from '../../settings.js';
import { runScenario } from './runner.js';

function parseUsers(usernames) {
    const names = (usernames || '')
        .split(',')
        .map((name) => name.trim())
        .filter(Boolean);
    if (names.length < 1 || names.length > 2) {
        throw new Error(
            'Set SCENARIO_USERS to the accounts that will play, e.g. SCENARIO_USERS=alice,bob'
        );
    }
    return names.map((username) => Settings.getUserWithDefaultsSet({ username }));
}

async function build(server, scenario, users, gameId) {
    const result = await runScenario(scenario, {
        users,
        router: server,
        gameId,
        logger,
        gameOptions: {
            cardData: server.cardData,
            packData: server.packData,
            restrictedListData: server.restrictedListData,
            titleCardData: server.titleCardData
        }
    });

    const { game } = result;
    game.scenario = scenario;
    game.on('sendGameState', () => server.sendGameState(game));

    if (result.error) {
        logger.error('Scenario test failed partway through:', result.error);
        game.addAlert('danger', 'Scenario stopped with an error: {0}', result.error.message);
    } else {
        game.addAlert(
            'info',
            'Scenario: {0}{1}',
            result.name,
            result.stoppedAtBreak ? ' (stopped at scenarioBreak)' : ''
        );
    }

    return game;
}

function syncWithLobby(server) {
    server.onGameSync((games) => server.gameSocket.onGameSync(games));
}

async function reset(server, scenario, users, oldGame) {
    let newGame;
    try {
        newGame = await build(server, scenario, users, oldGame.id);
    } catch (err) {
        logger.error('Scenario reset failed; keeping the previous game:', err);
        oldGame.addAlert('danger', 'Scenario reset failed: {0}', err.message);
        server.sendGameState(oldGame);
        return oldGame;
    }

    for (const player of Object.values(oldGame.getPlayersAndSpectators())) {
        const replacement = newGame.playersAndSpectators[player.name];
        if (player.socket && replacement) {
            replacement.lobbyId = player.lobbyId;
            replacement.id = player.socket.id;
            replacement.connectionSucceeded = true;
            replacement.socket = player.socket;
        }
    }

    server.games[newGame.id] = newGame;
    newGame.addAlert('warning', 'Scenario reset');
    server.sendGameState(newGame);
    return newGame;
}

export async function install(server, scenario, usernames) {
    const users = parseUsers(usernames);
    const specPath = scenario.split('#')[0];

    let game = await build(server, scenario, users, randomUUID());
    server.games[game.id] = game;
    syncWithLobby(server);
    logger.info(
        `Scenario ready as game ${game.id}; log in as ${users.map((user) => user.username).join(' or ')} to join`
    );

    fs.watchFile(specPath, { interval: 1000 }, async () => {
        logger.info('Spec changed, rebuilding the scenario');
        game = await reset(server, scenario, users, game);
    });
}
