/* global jasmine */

const range = require('lodash.range');

const Game = require('../../server/game/game.js');
const PlayerInteractionWrapper = require('./playerinteractionwrapper.js');
const Settings = require('../../server/settings.js');

const corePack = require('../../throneteki-json-data/packs/Core.json');
const titleCardData = createTitleCardLookup(corePack.cards);

function createTitleCardLookup(cards) {
    return cards
        .filter(card => card.type === 'title')
        .reduce((cardIndex, card) => {
            cardIndex[card.code] = card;
            return cardIndex;
        }, {});
}

class GameFlowWrapper {
    constructor(options) {
        let gameRouter = jasmine.createSpyObj('gameRouter', ['gameWon', 'handleError', 'playerLeft']);
        gameRouter.handleError.and.callFake((game, error) => {
            throw error;
        });
        let details = {
            name: 'player1\'s game',
            id: 12345,
            owner: { username: 'player1' },
            saveGameId: 12345,
            isMelee: !!options.isMelee,
            noTitleSetAside: true,
            players: this.generatePlayerDetails(options.numOfPlayers || (options.isMelee ? 3 : 2))
        };
        this.game = new Game(details, { router: gameRouter, titleCardData: titleCardData });
        this.game.started = true;
        this.game.disableWonPrompt = true;
        this.game.disableRevealAcknowledgement = true;

        this.allPlayers = this.game.getPlayers().map(player => new PlayerInteractionWrapper(this.game, player));
        this.playerToPlayerWrapperIndex = this.allPlayers.reduce((index, playerWrapper) => {
            index[playerWrapper.player] = playerWrapper;
            return index;
        }, {});
    }

    generatePlayerDetails(numOfPlayers) {
        return range(1, numOfPlayers + 1).map(i => {
            return { id: i.toString(), user: Settings.getUserWithDefaultsSet({ username: `player${i}` }) };
        });
    }

    eachPlayerInFirstPlayerOrder(handler) {
        let players = this.game.getPlayersInFirstPlayerOrder();
        let playersInOrder = players.map(player => this.playerToPlayerWrapperIndex[player]);

        for(let player of playersInOrder) {
            handler(player);
        }
    }

    startGame() {
        this.game.initialise();
    }

    keepStartingHands() {
        for(let player of this.allPlayers) {
            player.clickPrompt('Keep Hand');
        }
    }

    skipSetupPhase() {
        this.keepStartingHands();
        for(let player of this.allPlayers) {
            player.clickPrompt('Done');
        }
    }

    guardCurrentPhase(phase) {
        if(this.game.currentPhase !== phase) {
            throw new Error(`Expected to be in the ${phase} phase but actually was ${this.game.currentPhase}`);
        }
    }

    completeSetup() {
        this.guardCurrentPhase('setup');
        for(let player of this.allPlayers) {
            player.clickPrompt('Done');
        }
    }

    completeMarshalPhase() {
        this.guardCurrentPhase('marshal');
        this.eachPlayerInFirstPlayerOrder(player => player.clickPrompt('Done'));
    }

    completeChallengesPhase() {
        this.guardCurrentPhase('challenge');
        // Each player clicks 'Done' when challenge initiation prompt shows up.
        this.eachPlayerInFirstPlayerOrder(player => player.clickPrompt('Done'));
    }

    completeDominancePhase() {
        this.guardCurrentPhase('dominance');
        this.eachPlayerInFirstPlayerOrder(player => player.clickPrompt('Done'));
    }

    completeStandingPhase() {
        this.guardCurrentPhase('standing');
        this.eachPlayerInFirstPlayerOrder(player => player.clickPrompt('Done'));
    }

    completeTaxationPhase() {
        this.guardCurrentPhase('taxation');
        this.eachPlayerInFirstPlayerOrder(player => player.clickPrompt('Done'));
    }

    skipActionWindow() {
        this.eachPlayerInFirstPlayerOrder(player => player.clickPrompt('Pass'));
    }

    getPromptedPlayer(title) {
        var promptedPlayer = this.allPlayers.find(p => p.hasPrompt(title));

        if(!promptedPlayer) {
            var promptString = this.allPlayers.map(player => player.name + ': ' + player.formatPrompt()).join('\n\n');
            throw new Error(`No players are being prompted with "${title}". Current prompts are:\n\n${promptString}`);
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
        var opponent = this.allPlayers.find(p => p !== player);

        player.clickPrompt(type);
        player.clickCard(participant, 'play area');
        player.clickPrompt('Done');

        this.skipActionWindow();

        opponent.clickPrompt('Done');

        this.skipActionWindow();
    }
}

module.exports = GameFlowWrapper;
