// Generated with Claude Code - claude-opus-4-5-20251101
// - 2026-02-01: Added high-level game action helpers (marshalCard, playEvent, attachCard,
//               initiateChallenge, declareDefenders, passChallenge, applyClaim, selectClaimTarget)

import uuid from 'uuid';
import { matchCardByNameAndPack } from './cardutil.js';
import { detectBinary } from '../../server/util.js';

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

        if (!prompt) {
            return 'no prompt active';
        }

        let buttons = prompt.buttons.map((button) => {
            let text = button.disabled ? button.text + ' (Disabled)' : button.text;
            return `[${text}]`;
        });

        return prompt.menuTitle + '\n' + buttons.join('\n');
    }

    findCardByName(name, location = 'any') {
        if (typeof name !== 'string') {
            return name;
        }
        return this.filterCardsByName(name, location)[0];
    }

    filterCardsByName(name, location = 'any') {
        let matchFunc = matchCardByNameAndPack(name);
        let cards = this.game.allCards.filter(
            (card) =>
                card.controller === this.player &&
                matchFunc(card.cardData) &&
                (location === 'any' || card.location === location)
        );

        if (cards.length === 0) {
            var locationString = location === 'any' ? 'any location' : location;
            throw new Error(
                `Could not find any matching card "${name}" for ${this.player.name} in ${locationString}`
            );
        }

        return cards;
    }

    findCard(condition) {
        return this.filterCards(condition)[0];
    }

    filterCards(condition) {
        let cards = this.game.allCards.filter(
            (card) => card.controller === this.player && condition(card)
        );

        if (cards.length === 0) {
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
        if (typeof plot === 'string') {
            plot = this.findCardByName(plot, 'plot deck');
        }

        this.player.selectedPlot = plot;
        this.clickPrompt('Done');
    }

    selectTitle(title) {
        if (!this.hasPrompt('Select a title')) {
            throw new Error(
                `Couldn't select a title for ${this.name}. Current prompt is:\n\n${this.formatPrompt()}`
            );
        }
        this.clickPrompt(title);
    }

    nameTrait(trait) {
        let currentPrompt = this.player.currentPrompt();
        let traitControl = currentPrompt.controls.find((control) => control.type === 'trait-name');

        if (!traitControl) {
            throw new Error(
                `Couldn't name a trait for ${this.player.name}. Current prompt is:\n${this.formatPrompt()}`
            );
        }

        this.game.menuButton(this.player.name, trait, traitControl.method, traitControl.promptId);
        this.game.continue();
        this.checkUnserializableGameState();
    }

    selectValue(value) {
        let currentPrompt = this.player.currentPrompt();
        let selectValueControl = currentPrompt.controls.find(
            (control) => control.type === 'select-from-values'
        );

        if (!selectValueControl) {
            throw new Error(
                `Couldn't select a value for ${this.player.name}. Current prompt is:\n${this.formatPrompt()}`
            );
        }

        this.game.menuButton(
            this.player.name,
            value,
            selectValueControl.method,
            selectValueControl.promptId
        );
        this.game.continue();
        this.checkUnserializableGameState();
    }

    clickPrompt(text) {
        let currentPrompt = this.player.currentPrompt();
        let promptButton = currentPrompt.buttons.find(
            (button) => button.text.toLowerCase() === text.toLowerCase()
        );

        if (!promptButton) {
            throw new Error(
                `Couldn't click on "${text}" for ${this.player.name}. Current prompt is:\n${this.formatPrompt()}`
            );
        }

        if (promptButton.disabled) {
            throw new Error(
                `Couldn't click on "${text}" for ${this.player.name} because it is disabled. Current prompt is:\n${this.formatPrompt()}`
            );
        }

        this.game.menuButton(
            this.player.name,
            promptButton.arg,
            promptButton.method,
            promptButton.promptId
        );
        this.game.continue();
        this.checkUnserializableGameState();
    }

    clickCard(card, location = 'any') {
        if (typeof card === 'string') {
            card = this.findCardByName(card, location);
        }

        this.game.cardClicked(this.player.name, card.uuid);
        this.game.continue();
        this.checkUnserializableGameState();
    }

    clickMenu(card, menuText) {
        if (typeof card === 'string') {
            card = this.findCardByName(card);
        }

        var items = card.getMenu(this.player).filter((item) => item.text === menuText);

        if (items.length === 0) {
            throw new Error(`Card ${card.name} does not have a menu item "${menuText}"`);
        }

        if (items[0].disabled) {
            throw new Error(`Menu item "${menuText}" for ${card.name} is disabled`);
        }

        this.game.menuItemClick(this.player.name, card.uuid, items[0]);
        this.game.continue();
        this.checkUnserializableGameState();
    }

    hasEnabledMenu(card, menuText) {
        if (typeof card === 'string') {
            card = this.findCardByName(card);
        }

        const items = card.getMenu(this.player).filter((item) => item.text === menuText);
        return items.some((item) => !item.disabled);
    }

    triggerAbility(cardOrCardName) {
        if (!this.game.hasOpenInterruptOrReactionWindow()) {
            throw new Error(
                `Couldn't trigger ability for ${this.name}. Not in an ability window. Current prompt is:\n${this.formatPrompt()}`
            );
        }

        let selectableCards = this.player.getSelectableCards();
        let card;
        let cardName;

        if (typeof cardOrCardName === 'string') {
            card = selectableCards.find((c) => c.name === cardOrCardName);
            cardName = cardOrCardName;
        } else {
            card = cardOrCardName;
            cardName = cardOrCardName.name;
        }

        if (!card || !selectableCards.includes(card)) {
            throw new Error(
                `Couldn't trigger ability ${cardName} for ${this.name}. Current available abilities: ${selectableCards.map((c) => c.name).join(', ')}`
            );
        }

        if (card.location === 'draw deck') {
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

    sendChat(text) {
        this.game.chat(this.player.name, text);
        this.game.continue();
        this.checkUnserializableGameState();
    }

    discardToReserve() {
        let needsDiscard = this.player.hand.length - this.player.getReserve();
        for (let i = 0; i < needsDiscard; ++i) {
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

    toggleManualDupes(value) {
        this.player.promptDupes = value;
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

        if (results.length !== 0) {
            throw new Error(
                'Unable to serialize game state back to client:\n' + JSON.stringify(results)
            );
        }
    }

    /**
     * Setup a card from hand during the setup phase.
     * @param {string|object|Array} cardNameOrCard - Card name, card object, or array of cards to setup
     * @param {object} options - Optional parameters
     * @param {boolean} options.intoShadows - Whether to setup into shadows (default: false)
     */
    setupCards(cardNameOrCards, { intoShadows = false } = {}) {
        if (this.game.currentPhase !== 'setup') {
            throw new Error(
                `Cannot setup card - not in setup phase (current: ${this.game.currentPhase})`
            );
        }

        const cards = Array.isArray(cardNameOrCards) ? cardNameOrCards : [cardNameOrCards];
        const cardObjects = cards.map((card) => this.findCardByName(card, 'hand'));

        for (const card of cardObjects) {
            let expectedLocation = 'play area';
            let setupCost = card.getPrintedCost();

            this.clickCard(card);
            const buttons = this.currentPrompt().buttons;
            if (!intoShadows && buttons.some((b) => b.text === 'Setup')) {
                this.clickPrompt('Setup');
            } else if (intoShadows && buttons.some((b) => b.text === 'Setup into Shadows')) {
                this.clickPrompt('Setup into Shadows');
                expectedLocation = 'shadows';
                setupCost = 2;
            }

            if (card.location !== expectedLocation) {
                throw new Error(
                    `Cannot setup "${card.name}". ` +
                        `Gold: ${this.player.gold}, Cost: ${setupCost}`
                );
            }
        }
    }

    /**
     * Marshal a card from hand during the marshal phase.
     * @param {string|object|Array} cardNameOrCard - Card name, card object, or array of cards to marshal
     */
    marshalCards(cardNameOrCards, { intoShadows = false } = {}) {
        if (this.game.currentPhase !== 'marshal') {
            throw new Error(
                `Cannot marshal card - not in marshal phase (current: ${this.game.currentPhase})`
            );
        }

        const cards = Array.isArray(cardNameOrCards) ? cardNameOrCards : [cardNameOrCards];
        const cardObjects = cards.map((card) => this.findCardByName(card, 'hand'));

        for (const card of cardObjects) {
            let expectedLocation = 'play area';
            let marshalCost = card.getPrintedCost();

            this.clickCard(card);
            const buttons = this.currentPrompt().buttons;
            if (!intoShadows && buttons.some((b) => b.text === 'Marshal')) {
                this.clickPrompt('Marshal');
            } else if (intoShadows && buttons.some((b) => b.text === 'Marshal into Shadows')) {
                this.clickPrompt('Marshal into Shadows');
                expectedLocation = 'shadows';
                marshalCost = 2;
            }

            if (card.location !== expectedLocation) {
                throw new Error(
                    `Cannot setup "${card.name}". ` +
                        `Gold: ${this.player.gold}, Cost: ${marshalCost}`
                );
            }
        }
    }

    /**
     * Play an event card from hand.
     * @param {string|object} cardNameOrCard - Card name or card object to play
     * @param {object} options - Optional targeting options
     * @param {object|string} options.target - Single target for the event
     * @param {Array} options.targets - Multiple targets for the event
     */
    playEvent(cardNameOrCard, options = {}) {
        const card =
            typeof cardNameOrCard === 'string'
                ? this.findCardByName(cardNameOrCard, 'hand')
                : cardNameOrCard;

        if (card.getType() !== 'event') {
            throw new Error(
                `Cannot play "${card.name}" as event - not an event card (type: ${card.getType()})`
            );
        }

        if (card.location !== 'hand' && card.location !== 'shadows') {
            throw new Error(
                `Cannot play "${card.name}" - card not in hand or shadows (location: ${card.location})`
            );
        }

        this.clickCard(card);

        // Handle targeting if provided
        if (options.target) {
            this.clickCard(options.target);
        }

        if (options.targets) {
            for (const target of options.targets) {
                this.clickCard(target);
            }
        }
    }

    /**
     * Attach a card to a target during marshal or setup.
     * @param {string|object} attachmentNameOrCard - Attachment card name or object
     * @param {string|object} targetNameOrCard - Target card name or object
     */
    attachCard(attachmentNameOrCard, targetNameOrCard) {
        const attachment = this.findCardByName(attachmentNameOrCard, 'hand');
        const target = this.findCardByName(targetNameOrCard, 'play area');

        if (attachment.getType() !== 'attachment') {
            throw new Error(
                `Cannot attach "${attachment.name}" - not an attachment (type: ${attachment.getType()})`
            );
        }

        this.clickCard(attachment);
        this.clickCard(target);
    }

    /**
     * Initiate a challenge with specified type and attackers.
     * @param {object} options - Challenge options
     * @param {string} options.type - Challenge type: 'military', 'intrigue', or 'power'
     * @param {string|object|Array} options.attackers - Attacker card(s)
     * @param {object} options.opponent - Opponent player (for melee games)
     */
    initiateChallenge({ type, attackers, opponent = null }) {
        if (this.game.currentPhase !== 'challenge') {
            throw new Error(
                `Cannot initiate challenge - not in challenge phase (current: ${this.game.currentPhase})`
            );
        }

        const prompt = this.currentPrompt();
        const typeCapitalized = type.charAt(0).toUpperCase() + type.slice(1);
        const button = prompt.buttons.find((b) => b.text === typeCapitalized);

        if (!button) {
            throw new Error(
                `Cannot initiate ${type} challenge - not available. ` +
                    `Buttons: ${prompt.buttons.map((b) => b.text).join(', ')}`
            );
        }

        if (button.disabled) {
            throw new Error(
                `Cannot initiate ${type} challenge - button disabled (may have used all ${type} challenges)`
            );
        }

        this.clickPrompt(typeCapitalized);

        // Handle opponent selection in melee
        if (opponent) {
            this.clickPrompt(opponent.name);
        }

        // Declare attackers
        const attackerList = Array.isArray(attackers) ? attackers : [attackers];
        for (const attacker of attackerList) {
            this.clickCard(attacker);
        }

        this.clickPrompt('Done');
    }

    /**
     * Declare defenders when prompted.
     * @param {string|object|Array} defenders - Defender card(s), or empty/null for no defense
     */
    declareDefenders(defenders = []) {
        const prompt = this.currentPrompt();
        if (
            !prompt.menuTitle.toLowerCase().includes('defender') &&
            !prompt.menuTitle.toLowerCase().includes('select defender')
        ) {
            throw new Error(
                `Cannot declare defenders - not being prompted to defend. ` +
                    `Current prompt: ${prompt.menuTitle}`
            );
        }

        const defenderList = Array.isArray(defenders) ? defenders : [defenders];

        for (const defender of defenderList) {
            this.clickCard(defender);
        }

        this.clickPrompt('Done');
    }

    /**
     * Pass on initiating a challenge (click Done during challenge initiation).
     */
    passChallenge() {
        if (this.game.currentPhase !== 'challenge') {
            throw new Error(
                `Cannot pass challenge - not in challenge phase (current: ${this.game.currentPhase})`
            );
        }

        const prompt = this.currentPrompt();
        const doneButton = prompt.buttons.find((b) => b.text === 'Done');

        if (!doneButton) {
            throw new Error(
                `Cannot pass challenge - no "Done" button available. ` +
                    `Current prompt: ${prompt.menuTitle}`
            );
        }

        if (doneButton.disabled) {
            throw new Error(`Cannot pass challenge - must initiate a required challenge first`);
        }

        this.clickPrompt('Done');
    }

    /**
     * Apply claim after winning a challenge.
     */
    applyClaim() {
        const prompt = this.currentPrompt();
        if (!prompt.buttons.some((b) => b.text === 'Apply Claim')) {
            throw new Error(
                `Cannot apply claim - not being prompted. Current prompt: ${prompt.menuTitle}`
            );
        }
        this.clickPrompt('Apply Claim');
    }

    /**
     * Select a target for claim (military kill or intrigue discard).
     * @param {string|object} targetNameOrCard - Target card name or object
     */
    selectClaimTarget(targetNameOrCard) {
        const prompt = this.currentPrompt();
        if (
            !prompt.menuTitle.toLowerCase().includes('claim') &&
            !prompt.menuTitle.toLowerCase().includes('kill') &&
            !prompt.menuTitle.toLowerCase().includes('discard')
        ) {
            throw new Error(
                `Cannot select claim target - not in claim prompt. Current: ${prompt.menuTitle}`
            );
        }

        this.clickCard(targetNameOrCard);
    }
}

export default PlayerInteractionWrapper;
