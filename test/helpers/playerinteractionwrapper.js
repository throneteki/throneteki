const _ = require('underscore');
const uuid = require('uuid');

const { matchCardByNameAndPack } = require('./cardutil.js');

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
        var prompt = this.currentPrompt();

        if(!prompt) {
            return 'no prompt active';
        }

        return prompt.menuTitle + '\n' + _.map(prompt.buttons, button => '[ ' + button.text + ' ]').join('\n');
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
        let promptButton = _.find(currentPrompt.buttons, button => button.text.toLowerCase() === text.toLowerCase());

        if(!promptButton) {
            throw new Error(`Couldn't click on "${text}" for ${this.player.name}. Current prompt is:\n${this.formatPrompt()}`);
        }

        this.game.menuButton(this.player.name, promptButton.arg, promptButton.method);
        this.game.continue();
    }

    clickCard(card, location = 'any') {
        if(_.isString(card)) {
            card = this.findCardByName(card, location);
        }

        this.game.cardClicked(this.player.name, card.uuid);
        this.game.continue();
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
    }

    dragCard(card, targetLocation) {
        this.game.drop(this.player.name, card.uuid, card.location, targetLocation);
        this.game.continue();
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
}

module.exports = PlayerInteractionWrapper;
