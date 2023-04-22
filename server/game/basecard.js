const uuid = require('uuid');

const AbilityDsl = require('./abilitydsl');
const CardAction = require('./cardaction');
const CardForcedInterrupt = require('./cardforcedinterrupt');
const CardForcedReaction = require('./cardforcedreaction');
const CardInterrupt = require('./cardinterrupt');
const CardMatcher = require('./CardMatcher');
const CardReaction = require('./cardreaction');
const CustomPlayAction = require('./PlayActions/CustomPlayAction');
const EventRegistrar = require('./eventregistrar');
const GameActions = require('./GameActions');
const KeywordsProperty = require('./PropertyTypes/KeywordsProperty');
const ReferenceCountedSetProperty = require('./PropertyTypes/ReferenceCountedSetProperty');
const {Tokens} = require('./Constants');

const ValidKeywords = [
    'ambush',
    'assault',
    'bestow',
    'insight',
    'intimidate',
    'limited',
    'no attachments',
    'pillage',
    'prized',
    'renown',
    'shadow',
    'stealth',
    'terminal'
];

const ValidFactions = [
    'stark',
    'lannister',
    'thenightswatch',
    'tyrell',
    'baratheon',
    'targaryen',
    'martell',
    'greyjoy'
];

const LocationsWithEventHandling = ['play area', 'active plot', 'faction', 'agenda', 'title'];

class BaseCard {
    constructor(owner, cardData) {
        this.owner = owner;
        this.game = this.owner.game;
        this.cardData = cardData;

        this.uuid = uuid.v1();
        this.code = cardData.code;
        this.name = cardData.name;
        this.facedown = false;
        this.keywords = new KeywordsProperty();
        this.traits = new ReferenceCountedSetProperty();
        this.blanks = new ReferenceCountedSetProperty();
        this.losesAspects = new ReferenceCountedSetProperty();
        this.powerOptions = new ReferenceCountedSetProperty();
        this.controllerStack = [];
        this.eventsForRegistration = [];
        this.keywordSources = [];

        this.power = 0;
        this.tokens = {};
        this.plotModifierValues = {
            gold: 0,
            initiative: 0,
            reserve: 0
        };

        this.canProvidePlotModifier = {
            gold: true,
            initiative: true,
            reserve: true
        };

        this.abilityRestrictions = [];
        this.events = new EventRegistrar(this.game, this);

        this.abilities = { actions: [], reactions: [], persistentEffects: [], playActions: [] };

        this.setupCardTextProperties(AbilityDsl);
        this.setupCardAbilities(AbilityDsl);

        this.cardTypeSet = undefined;
    }

    static parseKeywords(text) {
        const lines = text.toLowerCase().split('\n');
        const potentialKeywordLines = lines.filter(line => !line.includes('<b>'));
        const potentialKeywords = potentialKeywordLines.reduce((words, line) => {
            return words.concat(line.split('.').map(word => word.trim()));
        }, []);

        return potentialKeywords.filter(potentialKeyword => {
            return ValidKeywords.some(keyword => potentialKeyword.indexOf(keyword) === 0);
        });
    }

    setupCardTextProperties(ability) {
        this.factions = new ReferenceCountedSetProperty();
        this.printedKeywords = BaseCard.parseKeywords(this.cardData.text || '');

        this.addFaction(this.cardData.faction);

        for(let trait of this.cardData.traits || []) {
            this.addTrait(trait);
        }

        if(this.printedKeywords.length > 0) {
            this.persistentEffect({
                match: this,
                location: 'any',
                targetLocation: 'any',
                effect: ability.effects.addMultipleKeywords(this.printedKeywords)
            });
        }
    }

    registerEvents(events) {
        this.eventsForRegistration = events;
    }

    setupCardAbilities() {
    }

    plotModifiers(modifiers) {
        this.plotModifierValues = Object.assign(this.plotModifierValues, modifiers);
        if(modifiers.gold) {
            this.persistentEffect({
                condition: () => this.canProvidePlotModifier['gold'],
                match: card => card.controller.activePlot === card,
                targetController: 'current',
                effect: AbilityDsl.effects.modifyGold(modifiers.gold)
            });
        }
        if(modifiers.initiative) {
            this.persistentEffect({
                condition: () => this.canProvidePlotModifier['initiative'],
                match: card => card.controller.activePlot === card,
                targetController: 'current',
                effect: AbilityDsl.effects.modifyInitiative(modifiers.initiative)
            });
        }
        if(modifiers.reserve) {
            this.persistentEffect({
                condition: () => this.canProvidePlotModifier['reserve'],
                match: card => card.controller.activePlot === card,
                targetController: 'current',
                effect: AbilityDsl.effects.modifyReserve(modifiers.reserve)
            });
        }
    }

    action(properties) {
        var action = new CardAction(this.game, this, properties);
        this.abilities.actions.push(action);
        return action;
    }

    reaction(properties) {
        var reaction = new CardReaction(this.game, this, properties);
        this.abilities.reactions.push(reaction);
    }

    forcedReaction(properties) {
        var reaction = new CardForcedReaction(this.game, this, properties);
        this.abilities.reactions.push(reaction);
    }

    interrupt(properties) {
        var reaction = new CardInterrupt(this.game, this, properties);
        this.abilities.reactions.push(reaction);
    }

    forcedInterrupt(properties) {
        var reaction = new CardForcedInterrupt(this.game, this, properties);
        this.abilities.reactions.push(reaction);
    }

    /**
     * Defines a special play action that can occur when the card is outside the
     * play area (e.g. Lady-in-Waiting's dupe marshal ability)
     */
    playAction(properties) {
        this.abilities.playActions.push(new CustomPlayAction(properties));
    }

    /**
     * Applies an effect that continues as long as the card providing the effect
     * is both in play and not blank.
     */
    persistentEffect(properties) {
        const allowedLocations = ['active plot', 'agenda', 'any', 'play area', 'revealed plots', 'title'];
        const defaultLocationForType = {
            agenda: 'agenda',
            plot: 'active plot',
            title: 'title'
        };

        let location = properties.location || defaultLocationForType[this.getType()] || 'play area';

        if(!allowedLocations.includes(location)) {
            throw new Error(`'${location}' is not a supported effect location.`);
        }

        this.abilities.persistentEffects.push(Object.assign({ duration: 'persistent', location: location }, properties));
    }

    /**
     * Applies an effect with the specified properties while the current card is
     * attached to another card. By default the effect will target the parent
     * card, but you can provide a match function to narrow down whether the
     * effect is applied (for cases where the effect only applies to specific
     * characters).
     */
    whileAttached(properties) {
        this.persistentEffect({
            condition: () => !!this.parent && (!properties.condition || properties.condition()),
            match: (card, context) => card === this.parent && (!properties.match || properties.match(card, context)),
            targetController: 'any',
            effect: properties.effect
        });
    }

    /**
     * Applies an immediate effect which lasts until the end of the current
     * challenge.
     */
    untilEndOfChallenge(propertyFactory) {
        var properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, Object.assign({ duration: 'untilEndOfChallenge', location: 'any' }, properties));
    }

    /**
     * Applies an immediate effect which lasts until the end of the phase.
     */
    untilEndOfPhase(propertyFactory) {
        var properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, Object.assign({ duration: 'untilEndOfPhase', location: 'any' }, properties));
    }

    /**
     * Applies an immediate effect which expires at the end of the current
     * challenge. Per game rules this duration is outside of the challenge.
     */
    atEndOfChallenge(propertyFactory) {
        var properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, Object.assign({ duration: 'atEndOfChallenge', location: 'any' }, properties));
    }

    /**
     * Applies an immediate effect which expires at the end of the phase. Per
     * game rules this duration is outside of the phase.
     */
    atEndOfPhase(propertyFactory) {
        var properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, Object.assign({ duration: 'atEndOfPhase', location: 'any' }, properties));
    }
    
    /**
     * Applies an immediate effect which lasts until the end of the round.
     */
    untilEndOfRound(propertyFactory) {
        var properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, Object.assign({ duration: 'untilEndOfRound', location: 'any' }, properties));
    }

    /**
     * Applies an immediate effect which expires at the end of the round. Per
     * game rules this duration is outside of the round.
     */
    atEndOfRound(propertyFactory) {
        var properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, Object.assign({ duration: 'atEndOfRound', location: 'any' }, properties));
    }

    /**
     * Applies a lasting effect which lasts until an event contained in the
     * `until` property for the effect has occurred.
     */
    lastingEffect(propertyFactory) {
        let properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, Object.assign({ duration: 'custom', location: 'any' }, properties));
    }

    doAction(player, arg) {
        var action = this.abilities.actions[arg];

        if(!action) {
            return;
        }

        action.execute(player, arg);
    }

    createSnapshot() {
        let clone = new BaseCard(this.owner, this.cardData);

        clone.blanks = this.blanks.clone();
        clone.controllerStack = [...this.controllerStack];
        clone.factions = this.factions.clone();
        clone.location = this.location;
        clone.losesAspects = this.losesAspects.clone();
        clone.keywords = this.keywords.clone();
        clone.parent = this.parent;
        clone.power = this.power;
        clone.tokens = Object.assign({}, this.tokens);
        clone.traits = this.traits.clone();

        return clone;
    }

    getPrintedNumberFor(value) {
        return (value === 'X' ? 0 : value) || 0;
    }

    translateXValue(value) {
        return value === '-' ? 0 : value;
    }

    getPlayActions() {
        return [];
    }

    get controller() {
        if(this.controllerStack.length === 0) {
            return this.owner;
        }

        return this.controllerStack[this.controllerStack.length - 1].controller;
    }

    takeControl(controller, source) {
        if(!source && controller === this.owner) {
            // On permanent take control by the original owner, revert all take
            // control effects
            this.controllerStack = [];
            return;
        }

        let tracking = { controller: controller, source: source };
        if(!source) {
            // Clear all other take control effects for permanent control
            this.controllerStack = [tracking];
        } else {
            this.controllerStack.push(tracking);
        }
    }

    revertControl(source) {
        this.controllerStack = this.controllerStack.filter(control => control.source !== source);
    }

    loseAspect(aspect) {
        this.losesAspects.add(aspect);
        this.markAsDirty();
    }

    restoreAspect(aspect) {
        this.losesAspects.remove(aspect);
        this.markAsDirty();
    }

    hasKeyword(keyword) {
        if(this.losesAspects.contains('keywords')) {
            return false;
        }

        return this.keywords.contains(keyword);
    }

    getKeywords() {
        return this.keywords.getValues();
    }

    hasPrintedKeyword(keyword) {
        return this.printedKeywords.includes(keyword.toLowerCase());
    }

    getPrintedKeywords() {
        return this.printedKeywords;
    }

    getPrizedValue() {
        return this.keywords.getPrizedValue();
    }

    hasTrait(trait) {
        if(this.losesAspects.contains('traits')) {
            return false;
        }

        return !this.isFullBlank() && this.traits.contains(trait);
    }

    isFaction(faction) {
        let normalizedFaction = faction.toLowerCase();

        if(this.losesAspects.contains('factions')) {
            return normalizedFaction === 'neutral';
        }

        if(normalizedFaction === 'neutral') {
            return ValidFactions.every(f => !this.factions.contains(f) || this.losesAspects.contains(`factions.${f}`));
        }

        return this.factions.contains(normalizedFaction) && !this.losesAspects.contains(`factions.${normalizedFaction}`);
    }

    isOutOfFaction() {
        return !this.isFaction(this.controller.getFaction()) && !this.isFaction('neutral');
    }

    getFactions() {
        let factions = ValidFactions.filter(faction => this.isFaction(faction));

        if(factions.length === 0) {
            factions.push('neutral');
        }

        return factions;
    }

    getFactionStatus() {
        let gainedFactions = ValidFactions.filter(faction => faction !== this.cardData.faction && this.isFaction(faction));
        let diff = gainedFactions.map(faction => ({ faction: faction, status: 'gained' }));

        if(!this.isFaction(this.cardData.faction) && this.cardData.faction !== 'neutral') {
            return diff.concat({ faction: this.cardData.faction, status: 'lost' });
        }

        return diff;
    }

    isLoyal() {
        return !!this.cardData.loyal;
    }

    canBeSaved() {
        return this.allowGameAction('save');
    }

    canGainPower() {
        return this.allowGameAction('gainPower');
    }

    getPower() {
        return this.power;
    }

    modifyPower(power) {
        let action = power > 0 ?
            GameActions.gainPower({ card: this, amount: power }) :
            GameActions.discardPower({ card: this, amount: -power });
        return this.game.resolveGameAction(action);
    }

    applyAnyLocationPersistentEffects() {
        for(let effect of this.abilities.persistentEffects) {
            if(effect.location === 'any') {
                this.game.addEffect(this, effect);
            }
        }
    }

    getPersistentEffects() {
        return this.abilities.persistentEffects.filter(effect => effect.location !== 'any');
    }

    applyPersistentEffects() {
        for(let effect of this.getPersistentEffects()) {
            this.game.addEffect(this, effect);
        }
    }

    leavesPlay() {
    }

    clearTokens() {
        this.tokens = {};
        this.power = 0;
    }

    moveTo(targetLocation, parent, wasFacedown = false) {
        let originalLocation = this.location;
        let originalParent = this.parent;

        if(originalParent) {
            originalParent.removeChildCard(this);
        }

        if(originalLocation !== targetLocation) {
            // Clear any tokens on the card unless it is transitioning position
            // within the same area e.g. moving an attachment from one character
            // to another, or a character transferring control between players.
            this.clearTokens();
        }

        this.location = targetLocation;
        this.parent = parent;

        if(LocationsWithEventHandling.includes(targetLocation) && !LocationsWithEventHandling.includes(originalLocation)) {
            this.events.register(this.eventsForRegistration);
        } else if(LocationsWithEventHandling.includes(originalLocation) && !LocationsWithEventHandling.includes(targetLocation)) {
            this.events.unregisterAll();
        }

        for(let action of this.abilities.actions) {
            if(action.isEventListeningLocation(targetLocation) && !action.isEventListeningLocation(originalLocation)) {
                action.registerEvents();
            } else if(action.isEventListeningLocation(originalLocation) && !action.isEventListeningLocation(targetLocation)) {
                action.unregisterEvents();
            }
        }
        for(let reaction of this.abilities.reactions) {
            if(reaction.isEventListeningLocation(targetLocation) && !reaction.isEventListeningLocation(originalLocation)) {
                reaction.registerEvents();
            } else if(reaction.isEventListeningLocation(originalLocation) && !reaction.isEventListeningLocation(targetLocation)) {
                reaction.unregisterEvents();
                this.game.clearAbilityResolution(reaction);
            }
        }

        if(targetLocation !== 'play area') {
            this.facedown = false;
        }

        if(originalLocation !== targetLocation || originalParent !== parent || (originalLocation === targetLocation && wasFacedown !== this.facedown)) {
            this.game.raiseEvent('onCardMoved', { card: this, originalLocation: originalLocation, newLocation: targetLocation, parentChanged: originalParent !== parent, facedownChanged: wasFacedown !== this.facedown });
        }
    }

    getMenu(player) {
        if(player.isSpectator()) {
            return;
        }

        let actionIndexPairs = this.abilities.actions.map((action, index) => [action, index]);
        let menuActionPairs = actionIndexPairs.filter(pair => {
            let action = pair[0];
            return action.allowPlayer(player) && !action.isClickToActivate() && action.allowMenu();
        });

        if(menuActionPairs.length === 0) {
            return;
        }

        return [
            { command: 'click', text: 'Select Card' }
        ].concat(menuActionPairs.map(([action, index]) => action.getMenuItem(index, player)));
    }

    isCopyOf(card) {
        return this.name === card.name;
    }

    isUnique() {
        return this.cardData.unique;
    }

    isAnyBlank() {
        return this.isFullBlank() || this.isBlankExcludingTraits();
    }

    isFullBlank() {
        return this.blanks.contains('full');
    }

    isBlankExcludingTraits() {
        return this.blanks.contains('excludingTraits');
    }

    isAttacking() {
        if(!this.game.currentChallenge) {
            return false;
        }

        return this.game.currentChallenge.isAttacking(this);
    }

    isDefending() {
        if(!this.game.currentChallenge) {
            return false;
        }

        return this.game.currentChallenge.isDefending(this);
    }

    isParticipating() {
        if(!this.game.currentChallenge) {
            return false;
        }

        return this.game.currentChallenge.isParticipating(this);
    }

    setCardType(cardType) {
        this.cardTypeSet = cardType;
    }

    getType() {
        return this.cardTypeSet || this.getPrintedType();
    }

    getPrintedType() {
        return this.cardData.type;
    }

    getPrintedFaction() {
        return this.cardData.faction;
    }

    setBlank(type) {
        let before = this.isAnyBlank();
        this.blanks.add(type);
        let after = this.isAnyBlank();

        if(!before && after) {
            this.game.raiseEvent('onCardBlankToggled', { card: this, isBlank: after });
        }
    }

    allowGameAction(actionType, context) {
        let currentAbilityContext = context || this.game.currentAbilityContext;
        return !this.abilityRestrictions.some(restriction => restriction.isMatch(actionType, currentAbilityContext));
    }

    addAbilityRestriction(restriction) {
        this.abilityRestrictions.push(restriction);
        this.markAsDirty();
    }

    removeAbilityRestriction(restriction) {
        this.abilityRestrictions = this.abilityRestrictions.filter(r => r !== restriction);
        this.markAsDirty();
    }

    addKeyword(keyword) {
        this.keywords.add(keyword);
    }

    addTrait(trait) {
        this.traits.add(trait);

        this.markAsDirty();
    }

    getTraits() {
        if(this.losesAspects.contains('traits')) {
            return [];
        }

        return this.traits.getValues();
    }

    addFaction(faction) {
        if(!faction) {
            return;
        }

        let lowerCaseFaction = faction.toLowerCase();
        this.factions.add(lowerCaseFaction);

        this.markAsDirty();
    }

    removeKeyword(keyword) {
        this.keywords.remove(keyword);
    }

    removeTrait(trait) {
        this.traits.remove(trait);
        this.markAsDirty();
    }

    removeFaction(faction) {
        this.factions.remove(faction.toLowerCase());
        this.markAsDirty();
    }

    clearBlank(type) {
        let before = this.isAnyBlank();
        this.blanks.remove(type);
        let after = this.isAnyBlank();

        if(before && !after) {
            this.game.raiseEvent('onCardBlankToggled', { card: this, isBlank: after });
        }
    }

    hasText(text) {
        let cardText = this.cardData.text.toLowerCase();
        return cardText.includes(text.toLowerCase());
    }

    get gold() {
        return this.tokens[Tokens.gold] || 0;
    }

    modifyGold(amount) {
        this.modifyToken(Tokens.gold, amount);
    }

    hasToken(type) {
        return !!this.tokens[type];
    }

    modifyToken(type, number) {
        if(!this.tokens[type]) {
            this.tokens[type] = 0;
        }

        this.tokens[type] += number;

        if(this.tokens[type] < 0) {
            this.tokens[type] = 0;
        }

        if(this.tokens[type] === 0) {
            delete this.tokens[type];
        }

        this.markAsDirty();
    }

    isMatch(properties) {
        return CardMatcher.isMatch(this, properties);
    }

    markAsDirty() {
        this.isDirty = true;
    }

    clearDirty() {
        this.isDirty = false;
    }

    onClick(player) {
        var action = this.abilities.actions.find(action => action.isClickToActivate());
        if(action) {
            return action.execute(player) || action.deactivate(player);
        }

        return false;
    }

    getGameElementType() {
        return 'card';
    }

    getShortSummary() {
        return {
            code: this.cardData.code,
            label: this.cardData.label,
            name: this.cardData.name,
            type: this.getType()
        };
    }

    getSummary(activePlayer) {
        let selectionState = activePlayer.getCardSelectionState(this);

        if(!this.game.isCardVisible(this, activePlayer)) {
            return { facedown: true, uuid: this.uuid, tokens: this.tokens, ...selectionState };
        }

        let state = {
            code: this.cardData.code,
            controlled: this.owner !== this.controller && this.getType() !== 'title',
            facedown: this.facedown,
            factionStatus: this.getFactionStatus(),
            menu: this.getMenu(activePlayer),
            name: this.cardData.label,
            new: this.new,
            power: this.power,
            tokens: this.tokens,
            type: this.getType(),
            uuid: this.uuid
        };

        return Object.assign(state, selectionState);
    }
}

module.exports = BaseCard;
