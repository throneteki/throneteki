/* global jasmine */

const _ = require('underscore');

const Game = require('../../server/game/game.js');
const PlayerInteractionWrapper = require('./playerinteractionwrapper.js');
const Settings = require('../../server/settings.js');

const coreCardData = require('../../thronesdb-json-data/pack/Core.json');
const titleCardData = createTitleCardLookup(coreCardData);

function createTitleCardLookup(cards) {
    return cards
        .filter(card => card.type_code === 'title')
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
            players: this.generatePlayerDetails(options.numOfPlayers || options.isMelee ? 3 : 2)
        };
        this.game = new Game(details, { router: gameRouter, titleCardData: titleCardData });

        this.allPlayers = this.game.getPlayers().map(player => new PlayerInteractionWrapper(this.game, player));
    }

    generatePlayerDetails(numOfPlayers) {
        return _.range(1, numOfPlayers + 1).map(i => {
            return { id: i.toString(), user: Settings.getUserWithDefaultsSet({ username: `player${i}` }) };
        });
    }

    eachPlayerInFirstPlayerOrder(handler) {
        var playersInOrder = _.sortBy(this.allPlayers, player => !player.firstPlayer);

        _.each(playersInOrder, player => handler(player));
    }

    startGame() {
        this.game.initialise();
    }

    keepStartingHands() {
        _.each(this.allPlayers, player => player.clickPrompt('Keep Hand'));
    }

    skipSetupPhase() {
        this.keepStartingHands();
        _.each(this.allPlayers, player => player.clickPrompt('Done'));
    }

    guardCurrentPhase(phase) {
        if(this.game.currentPhase !== phase) {
            throw new Error(`Expected to be in the ${phase} phase but actually was ${this.game.currentPhase}`);
        }
    }

    completeSetup() {
        this.guardCurrentPhase('setup');
        _.each(this.allPlayers, player => player.clickPrompt('Done'));
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
            var promptString = _.map(this.allPlayers, player => player.name + ': ' + player.formatPrompt()).join('\n\n');
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
