import fs from 'fs';
import path from 'path';
import range from 'lodash.range';

import Game from '../../server/game/game.js';
import PlayerInteractionWrapper from './playerinteractionwrapper.js';
import Settings from '../../server/settings.js';
const corePack = JSON.parse(
    fs.readFileSync(
        path.join(import.meta.dirname, '../../throneteki-json-data/packs/Core.json'),
        'utf8'
    )
);
const titleCardData = createTitleCardLookup(corePack.cards);

function createTitleCardLookup(cards) {
    return cards
        .filter((card) => card.type === 'title')
        .reduce((cardIndex, card) => {
            cardIndex[card.code] = card;
            return cardIndex;
        }, {});
}

const defaultNumOfPlayers = {
    melee: 3,
    joust: 2
};

class GameFlowWrapper {
    constructor(options) {
        const gameRouter = options.router || {
            gameOver: () => true,
            handleError: (game, error) => {
                throw error;
            },
            playerLeft: () => true
        };
        const numOfPlayers =
            options.numOfPlayers || defaultNumOfPlayers[options.gameFormat || 'joust'];
        const players = this.generatePlayerDetails(numOfPlayers, options.users);
        const owner = players[0].user;
        const details = {
            name: `${owner.username}'s game`,
            id: options.gameId || 12345,
            owner,
            saveGameId: options.gameId || 12345,
            gameFormat: options.gameFormat,
            noTitleSetAside: true,
            maxPlayers: options.maxPlayers || numOfPlayers,
            players
        };
        this.game = new Game(details, {
            router: gameRouter,
            titleCardData: titleCardData,
            // Specs use manual actions as setup shortcuts; pass 'auto' to test the real default.
            manualMode: true,
            ...options.gameOptions
        });
        this.game.started = true;

        this.game.disableWinning = options.disableWinning ?? true;
        this.game.disableRevealAcknowledgement = options.disableRevealAcknowledgement ?? true;

        this.allPlayers = this.game.getPlayers().map(
            (player, index) =>
                new PlayerInteractionWrapper(this.game, player, {
                    key: `player${index + 1}`,
                    keepUser: !!options.users
                })
        );
        this.playerToPlayerWrapperIndex = this.allPlayers.reduce((index, playerWrapper) => {
            index[playerWrapper.player.name] = playerWrapper;
            return index;
        }, {});
    }

    generatePlayerDetails(numOfPlayers, users = []) {
        return range(1, numOfPlayers + 1).map((i) => {
            return {
                id: i.toString(),
                user: Settings.getUserWithDefaultsSet(users[i - 1] || { username: `player${i}` }),
                seatNo: i
            };
        });
    }

    eachPlayerInFirstPlayerOrder(handler) {
        let players = this.game.getPlayersInFirstPlayerOrder();
        let playersInOrder = players.map((player) => this.playerToPlayerWrapperIndex[player.name]);

        for (let player of playersInOrder) {
            handler(player);
        }
    }

    startGame() {
        this.game.initialise();
    }

    keepStartingHands() {
        for (let player of this.allPlayers) {
            player.clickPrompt('Keep Hand');
        }
    }

    skipSetupPhase() {
        this.keepStartingHands();
        for (let player of this.allPlayers) {
            player.clickPrompt('Done');
        }
    }

    guardCurrentPhase(phase) {
        if (this.game.currentPhase !== phase) {
            throw new Error(
                `Expected to be in the ${phase} phase but actually was ${this.game.currentPhase}`
            );
        }
    }

    completeSetup() {
        this.guardCurrentPhase('setup');
        for (let player of this.allPlayers) {
            player.clickPrompt('Done');
        }
    }

    completeMarshalPhase() {
        this.guardCurrentPhase('marshal');
        this.eachPlayerInFirstPlayerOrder((player) => player.clickPrompt('Done'));
    }

    completeChallengesPhase() {
        this.guardCurrentPhase('challenge');
        // Each player clicks 'Done' when challenge initiation prompt shows up.
        this.eachPlayerInFirstPlayerOrder((player) => player.clickPrompt('Done'));
    }

    completeDominancePhase() {
        this.guardCurrentPhase('dominance');
        this.eachPlayerInFirstPlayerOrder((player) => player.clickPrompt('Done'));
    }

    completeStandingPhase() {
        this.guardCurrentPhase('standing');
        this.eachPlayerInFirstPlayerOrder((player) => player.clickPrompt('Done'));
    }

    completeTaxationPhase() {
        this.guardCurrentPhase('taxation');
        this.eachPlayerInFirstPlayerOrder((player) => player.clickPrompt('Done'));
    }

    completeRound() {
        if (this.game.currentPhase === 'marshal') {
            this.completeMarshalPhase();
        }
        if (this.game.currentPhase === 'challenge') {
            this.completeChallengesPhase();
        }
        if (this.game.currentPhase === 'dominance') {
            this.completeDominancePhase();
        }
        if (this.game.currentPhase === 'standing') {
            this.completeStandingPhase();
        }
        if (this.game.currentPhase === 'taxation') {
            this.completeTaxationPhase();
        }
    }

    skipActionWindow() {
        this.eachPlayerInFirstPlayerOrder((player) => player.clickPrompt('Pass'));
    }

    getPromptedPlayer(title) {
        var promptedPlayer = this.allPlayers.find((p) => p.hasPrompt(title));

        if (!promptedPlayer) {
            var promptString = this.allPlayers
                .map((player) => player.name + ': ' + player.formatPrompt())
                .join('\n\n');
            throw new Error(
                `No players are being prompted with "${title}". Current prompts are:\n\n${promptString}`
            );
        }

        return promptedPlayer;
    }

    selectFirstPlayer(player) {
        var promptedPlayer = this.getPromptedPlayer('Select first player');
        promptedPlayer.clickPrompt(player.name);
    }

    selectPlotOrder(player) {
        let promptedPlayer = this.getPromptedPlayer('Choose when revealed order');
        let buttonText = player.name + ' - ' + player.activePlot.name;
        promptedPlayer.clickPrompt(buttonText);
    }

    unopposedChallenge(player, type, participant) {
        var opponent = this.allPlayers.find((p) => p !== player);

        player.clickPrompt(type);
        player.clickCard(participant, 'play area');
        player.clickPrompt('Done');

        this.skipActionWindow();

        opponent.clickPrompt('Done');

        this.skipActionWindow();
    }
}

export default GameFlowWrapper;
