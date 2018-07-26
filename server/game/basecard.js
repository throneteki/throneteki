const uuid = require('uuid');
const _ = require('underscore');

const AbilityDsl = require('./abilitydsl');
const CardAction = require('./cardaction');
const CardForcedInterrupt = require('./cardforcedinterrupt');
const CardForcedReaction = require('./cardforcedreaction');
const CardInterrupt = require('./cardinterrupt');
const CardReaction = require('./cardreaction');
const CustomPlayAction = require('./PlayActions/CustomPlayAction');
const EventRegistrar = require('./eventregistrar');
const KeywordsProperty = require('./PropertyTypes/KeywordsProperty');
const ReferenceCountedSetProperty = require('./PropertyTypes/ReferenceCountedSetProperty');

const ValidKeywords = [
    'ambush',
    'bestow',
    'insight',
    'intimidate',
    'limited',
    'no attachments',
    'pillage',
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
        this.controllerStack = [];

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
        this.menu = [];
        this.events = new EventRegistrar(this.game, this);

        this.abilities = { actions: [], reactions: [], persistentEffects: [], playActions: [] };
        this.parseKeywords(cardData.text || '');
        for(let trait of cardData.traits || []) {
            this.addTrait(trait);
        }

        this.setupCardAbilities(AbilityDsl);

        this.factions = new ReferenceCountedSetProperty();
        this.cardTypeSet = undefined;
        this.addFaction(cardData.faction);
    }

    parseKeywords(text) {
        let firstLine = text.split('\n')[0] || '';
        let potentialKeywords = firstLine.split('.').map(k => k.toLowerCase().trim());

        this.printedKeywords = potentialKeywords.filter(potentialKeyword => {
            return ValidKeywords.some(keyword => potentialKeyword.indexOf(keyword) === 0);
        });

        if(this.printedKeywords.length > 0) {
            this.persistentEffect({
                match: this,
                location: 'any',
                targetLocation: 'any',
                effect: AbilityDsl.effects.addMultipleKeywords(this.printedKeywords)
            });
        }
    }

    registerEvents(events) {
        this.eventsForRegistration = events;
    }

    setupCardAbilities() {
    }

    plotModifiers(modifiers) {
        this.plotModifierValues = _.extend(this.plotModifierValues, modifiers);
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

        if(!action.isClickToActivate() && action.allowMenu()) {
            var index = this.abilities.actions.length;
            this.menu.push(action.getMenuItem(index));
        }
        this.abilities.actions.push(action);
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
        const allowedLocations = ['active plot', 'agenda', 'any', 'play area', 'title'];
        const defaultLocationForType = {
            agenda: 'agenda',
            plot: 'active plot',
            title: 'title'
        };

        let location = properties.location || defaultLocationForType[this.getType()] || 'play area';

        if(!allowedLocations.includes(location)) {
            throw new Error(`'${location}' is not a supported effect location.`);
        }

        this.abilities.persistentEffects.push(_.extend({ duration: 'persistent', location: location }, properties));
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
        this.game.addEffect(this, _.extend({ duration: 'untilEndOfChallenge', location: 'any' }, properties));
    }

    /**
     * Applies an immediate effect which lasts until the end of the phase.
     */
    untilEndOfPhase(propertyFactory) {
        var properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, _.extend({ duration: 'untilEndOfPhase', location: 'any' }, properties));
    }

    /**
     * Applies an immediate effect which expires at the end of the phase. Per
     * game rules this duration is outside of the phase.
     */
    atEndOfPhase(propertyFactory) {
        var properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, _.extend({ duration: 'atEndOfPhase', location: 'any' }, properties));
    }

    /**
     * Applies an immediate effect which lasts until the end of the round.
     */
    untilEndOfRound(propertyFactory) {
        var properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, _.extend({ duration: 'untilEndOfRound', location: 'any' }, properties));
    }

    /**
     * Applies a lasting effect which lasts until an event contained in the
     * `until` property for the effect has occurred.
     */
    lastingEffect(propertyFactory) {
        let properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, _.extend({ duration: 'custom', location: 'any' }, properties));
    }

    doAction(player, arg) {
        var action = this.abilities.actions[arg];

        if(!action) {
            return;
        }

        action.execute(player, arg);
    }

    getPrintedNumberFor(value) {
        return (value === 'X' ? 0 : value) || 0;
    }

    translateXValue(value) {
        return value === '-' ? 0 : value;
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

    hasPrintedKeyword(keyword) {
        return this.printedKeywords.includes(keyword.toLowerCase());
    }

    getPrintedKeywords() {
        return this.printedKeywords;
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
        let factions = _.filter(ValidFactions, faction => this.isFaction(faction));

        if(_.isEmpty(factions)) {
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

    applyAnyLocationPersistentEffects() {
        _.each(this.abilities.persistentEffects, effect => {
            if(effect.location === 'any') {
                this.game.addEffect(this, effect);
            }
        });
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
        this.tokens = {};
    }

    moveTo(targetLocation, parent) {
        let originalLocation = this.location;
        let originalParent = this.parent;

        this.location = targetLocation;
        this.parent = parent;

        if(LocationsWithEventHandling.includes(targetLocation) && !LocationsWithEventHandling.includes(originalLocation)) {
            this.events.register(this.eventsForRegistration);
        } else if(LocationsWithEventHandling.includes(originalLocation) && !LocationsWithEventHandling.includes(targetLocation)) {
            this.events.unregisterAll();
        }

        _.each(this.abilities.actions, action => {
            if(action.isEventListeningLocation(targetLocation) && !action.isEventListeningLocation(originalLocation)) {
                action.registerEvents();
            } else if(action.isEventListeningLocation(originalLocation) && !action.isEventListeningLocation(targetLocation)) {
                action.unregisterEvents();
            }
        });
        _.each(this.abilities.reactions, reaction => {
            if(reaction.isEventListeningLocation(targetLocation) && !reaction.isEventListeningLocation(originalLocation)) {
                reaction.registerEvents();
            } else if(reaction.isEventListeningLocation(originalLocation) && !reaction.isEventListeningLocation(targetLocation)) {
                reaction.unregisterEvents();
                this.game.clearAbilityResolution(reaction);
            }
        });

        if(targetLocation !== 'play area') {
            this.facedown = false;
        }

        if(originalLocation !== targetLocation || originalParent !== parent) {
            this.game.raiseEvent('onCardMoved', { card: this, originalLocation: originalLocation, newLocation: targetLocation, parentChanged: originalParent !== parent });
        }
    }

    getMenu() {
        var menu = [];

        if(this.menu.length === 0) {
            return undefined;
        }

        menu.push({ command: 'click', text: 'Select Card' });
        menu = menu.concat(this.menu);

        return menu;
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
        return this.game.currentChallenge && this.game.currentChallenge.isAttacking(this);
    }

    isDefending() {
        return this.game.currentChallenge && this.game.currentChallenge.isDefending(this);
    }

    isParticipating() {
        return this.game.currentChallenge && this.game.currentChallenge.isParticipating(this);
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
        return !_.any(this.abilityRestrictions, restriction => restriction.isMatch(actionType, currentAbilityContext));
    }

    addAbilityRestriction(restriction) {
        this.abilityRestrictions.push(restriction);
        this.markAsDirty();
    }

    removeAbilityRestriction(restriction) {
        this.abilityRestrictions = _.reject(this.abilityRestrictions, r => r === restriction);
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

    get gold() {
        return this.tokens['gold'] || 0;
    }

    modifyGold(amount) {
        this.modifyToken('gold', amount);
    }

    hasToken(type) {
        return !!this.tokens[type];
    }

    modifyToken(type, number) {
        if(_.isUndefined(this.tokens[type])) {
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

    markAsDirty() {
        this.isDirty = true;
    }

    clearDirty() {
        this.isDirty = false;
    }

    onClick(player) {
        var action = _.find(this.abilities.actions, action => action.isClickToActivate());
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

    getSummary(activePlayer, hideWhenFaceup) {
        let isActivePlayer = activePlayer === this.controller;

        if(!isActivePlayer && (this.facedown || hideWhenFaceup)) {
            return { facedown: true };
        }

        let selectionState = activePlayer.getCardSelectionState(this);
        let state = {
            code: this.cardData.code,
            controlled: this.owner !== this.controller && this.getType() !== 'title',
            facedown: this.facedown,
            factionStatus: this.getFactionStatus(),
            menu: this.getMenu(),
            name: this.cardData.label,
            new: this.new,
            tokens: this.tokens,
            type: this.getType(),
            uuid: this.uuid
        };

        return _.extend(state, selectionState);
    }
}

module.exports = BaseCard;
