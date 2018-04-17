const uuid = require('uuid');
const _ = require('underscore');

const AbilityDsl = require('./abilitydsl.js');
const CardAction = require('./cardaction.js');
const CardForcedInterrupt = require('./cardforcedinterrupt.js');
const CardForcedReaction = require('./cardforcedreaction.js');
const CardInterrupt = require('./cardinterrupt.js');
const CardReaction = require('./cardreaction.js');
const CustomPlayAction = require('./customplayaction.js');
const EventRegistrar = require('./eventregistrar.js');
const ReferenceCountedSetProperty = require('./PropertyTypes/ReferenceCountedSetProperty');

const ValidKeywords = [
    'ambush',
    'insight',
    'intimidate',
    'pillage',
    'renown',
    'stealth',
    'terminal',
    'limited'
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
        this.controller = owner;
        this.game = this.owner.game;
        this.cardData = cardData;

        this.uuid = uuid.v1();
        this.code = cardData.code;
        this.name = cardData.name;
        this.facedown = false;
        this.blankCount = 0;
        this.keywords = new ReferenceCountedSetProperty();
        this.traits = new ReferenceCountedSetProperty();

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

        this.factions = {};
        this.cardTypeSet = undefined;
        this.addFaction(cardData.faction);
    }

    parseKeywords(text) {
        var firstLine = text.split('\n')[0];
        var potentialKeywords = _.map(firstLine.split('.'), k => k.toLowerCase().trim());

        this.printedKeywords = [];
        this.allowedAttachmentTrait = 'any';

        _.each(potentialKeywords, keyword => {
            if(_.contains(ValidKeywords, keyword)) {
                this.printedKeywords.push(keyword);
            } else if(keyword.indexOf('no attachment') === 0) {
                var match = keyword.match(/no attachments except <[bi]>(.*)<\/[bi]>/);
                if(match) {
                    this.allowedAttachmentTrait = match[1];
                } else {
                    this.allowedAttachmentTrait = 'none';
                }
            } else if(keyword.indexOf('ambush') === 0) {
                match = keyword.match(/ambush \((.*)\)/);
                if(match) {
                    this.ambushCost = parseInt(match[1]);
                }
            } else if(keyword.indexOf('bestow') === 0) {
                match = keyword.match(/bestow \((.*)\)/);
                if(match) {
                    this.bestowMax = parseInt(match[1]);
                }
            }
        });

        if(this.printedKeywords.length > 0) {
            this.persistentEffect({
                match: this,
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
            condition: properties.condition,
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

    hasKeyword(keyword) {
        return this.keywords.contains(keyword);
    }

    hasPrintedKeyword(keyword) {
        return this.printedKeywords.includes(keyword.toLowerCase());
    }

    getPrintedKeywords() {
        return _.filter(ValidKeywords, keyword => this.hasPrintedKeyword(keyword));
    }

    hasTrait(trait) {
        return this.traits.contains(trait);
    }

    isFaction(faction) {
        let normalizedFaction = faction.toLowerCase();

        if(normalizedFaction === 'neutral') {
            return !!this.factions[normalizedFaction] && _.size(this.factions) === 1;
        }

        return !!this.factions[normalizedFaction];
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

    isLoyal() {
        return this.cardData.loyal;
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
        this.cardTypeSet = undefined;
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

    isUnique() {
        return this.cardData.unique;
    }

    isBlank() {
        return this.blankCount > 0;
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

    setBlank() {
        var before = this.isBlank();
        this.blankCount++;
        var after = this.isBlank();
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
        return this.traits.getValues();
    }

    addFaction(faction) {
        if(!faction) {
            return;
        }

        let lowerCaseFaction = faction.toLowerCase();
        this.factions[lowerCaseFaction] = this.factions[lowerCaseFaction] || 0;
        this.factions[lowerCaseFaction]++;

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
        this.factions[faction.toLowerCase()]--;
        this.markAsDirty();
    }

    clearBlank() {
        var before = this.isBlank();
        this.blankCount--;
        var after = this.isBlank();
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
        let isActivePlayer = activePlayer === this.owner;

        if(!isActivePlayer && (this.facedown || hideWhenFaceup)) {
            return { facedown: true };
        }

        let selectionState = activePlayer.getCardSelectionState(this);
        let state = {
            code: this.cardData.code,
            controlled: this.owner !== this.controller && this.getType() !== 'title',
            facedown: this.facedown,
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
