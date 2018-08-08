const _ = require('underscore');
const uuid = require('uuid');

const { matchCardByNameAndPack } = require('./cardutil.js');
const { detectBinary } = require('../../server/util');

class PlayerInteractionWrapper {
    constructor(game, player) {
        this.game = game;
        this.player = player;

        player.noTimer = true;
        player.user = {
            settings: {}
        };
    }

    get name() {
        return this.player.name;
    }

    get firstPlayer() {
        return this.player.firstPlayer;
    }

    get activePlot() {
        return this.player.activePlot;
    }

    currentPrompt() {
        return this.player.currentPrompt();
    }

    formatPrompt() {
        let prompt = this.currentPrompt();

        if(!prompt) {
            return 'no prompt active';
        }

        let buttons = prompt.buttons.map(button => {
            let text = button.disabled ? button.text + ' (Disabled)' : button.text;
            return `[${text}]`;
        });

        return prompt.menuTitle + '\n' + buttons.join('\n');
    }

    findCardByName(name, location = 'any') {
        return this.filterCardsByName(name, location)[0];
    }

    filterCardsByName(name, location = 'any') {
        let matchFunc = matchCardByNameAndPack(name);
        let cards = this.game.allCards.filter(card => card.controller === this.player && matchFunc(card.cardData) && (location === 'any' || card.location === location));

        if(cards.length === 0) {
            var locationString = location === 'any' ? 'any location' : location;
            throw new Error(`Could not find any matching card "${name}" for ${this.player.name} in ${locationString}`);
        }

        return cards;
    }

    findCard(condition) {
        return this.filterCards(condition)[0];
    }

    filterCards(condition) {
        let cards = this.game.allCards.filter(card => card.controller === this.player && condition(card));

        if(cards.length === 0) {
            throw new Error(`Could not find any matching cards for ${this.player.name}`);
        }

        return cards;
    }

    hasPrompt(title) {
        var currentPrompt = this.player.currentPrompt();
        return !!currentPrompt && currentPrompt.menuTitle.toLowerCase() === title.toLowerCase();
    }

    selectDeck(deck) {
        this.game.selectDeck(this.player.name, deck);
    }

    selectPlot(plot) {
        if(_.isString(plot)) {
            plot = this.findCardByName(plot, 'plot deck');
        }

        this.player.selectedPlot = plot;
        this.clickPrompt('Done');
    }

    selectTitle(title) {
        if(!this.hasPrompt('Select a title')) {
            throw new Error(`Couldn't select a title for ${this.name}. Current prompt is:\n\n${this.formatPrompt()}`);
        }
        this.clickPrompt(title);
    }

    clickPrompt(text) {
        let currentPrompt = this.player.currentPrompt();
        let promptButton = currentPrompt.buttons.find(button => button.text.toLowerCase() === text.toLowerCase());

        if(!promptButton) {
            throw new Error(`Couldn't click on "${text}" for ${this.player.name}. Current prompt is:\n${this.formatPrompt()}`);
        }

        if(promptButton.disabled) {
            throw new Error(`Couldn't click on "${text}" for ${this.player.name} because it is disabled. Current prompt is:\n${this.formatPrompt()}`);
        }

        this.game.menuButton(this.player.name, promptButton.arg, promptButton.method);
        this.game.continue();
        this.checkUnserializableGameState();
    }

    clickCard(card, location = 'any') {
        if(_.isString(card)) {
            card = this.findCardByName(card, location);
        }

        if(card.location === 'draw deck') {
            throw new Error(`Cannot click on ${card.name} because it is in the ${card.location}.`);
        }

        this.game.cardClicked(this.player.name, card.uuid);
        this.game.continue();
        this.checkUnserializableGameState();
    }

    clickMenu(card, menuText) {
        if(_.isString(card)) {
            card = this.findCardByName(card);
        }

        var items = _.filter(card.getMenu(), item => item.text === menuText);

        if(items.length === 0) {
            throw new Error(`Card ${card.name} does not have a menu item "${menuText}"`);
        }

        this.game.menuItemClick(this.player.name, card.uuid, items[0]);
        this.game.continue();
        this.checkUnserializableGameState();
    }

    triggerAbility(cardOrCardName) {
        if(!this.game.hasOpenInterruptOrReactionWindow()) {
            throw new Error(`Couldn't trigger ability for ${this.name}. Not in an ability window. Current prompt is:\n${this.formatPrompt()}`);
        }

        let selectableCards = this.player.getSelectableCards();
        let card;
        let cardName;

        if(typeof cardOrCardName === 'string') {
            card = selectableCards.find(c => c.name === cardOrCardName);
            cardName = cardOrCardName;
        } else {
            card = cardOrCardName;
            cardName = cardOrCardName.name;
        }

        if(!card || !selectableCards.includes(card)) {
            throw new Error(`Couldn't trigger ability ${cardName} for ${this.name}. Current available abilities: ${selectableCards.map(c => c.name).join(', ')}`);
        }

        if(card.location === 'draw deck') {
            // Abilities on cards that are still in the draw deck, e.g. Missandei,
            // are presented as buttons instead.
            this.clickPrompt(`${card.name} (${card.location})`);
        } else {
            this.clickCard(card);
        }
    }

    dragCard(card, targetLocation) {
        this.game.drop(this.player.name, card.uuid, card.location, targetLocation);
        this.game.continue();
        this.checkUnserializableGameState();
    }

    discardToReserve() {
        let needsDiscard = this.player.hand.length - this.player.getTotalReserve();
        for(let i = 0; i < needsDiscard; ++i) {
            this.clickCard(this.player.hand[i]);
        }
        this.clickPrompt('Done');
    }

    togglePromptedActionWindow(window, value) {
        this.player.promptedActionWindows[window] = value;
    }

    toggleKeywordSettings(setting, value) {
        this.player.keywordSettings[setting] = value;
    }

    reconnect() {
        let newSocket = { id: uuid.v1() };
        this.game.reconnect(newSocket, this.player.name);
    }

    mockShuffle(func) {
        this.player.shuffleArray = func;
    }

    checkUnserializableGameState() {
        let state = this.game.getState(this.player.name);
        let results = detectBinary(state);

        if(results.length !== 0) {
            throw new Error('Unable to serialize game state back to client:\n' + JSON.stringify(results));
        }
    }
}

module.exports = PlayerInteractionWrapper;
