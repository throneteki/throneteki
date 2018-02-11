const _ = require('underscore');

const AbilityContext = require('./AbilityContext.js');
const BaseAbility = require('./baseability.js');
const Costs = require('./costs.js');
const EventRegistrar = require('./eventregistrar.js');

/**
 * Represents an action ability provided by card text.
 *
 * Properties:
 * title        - string that is used within the card menu associated with this
 *                action.
 * condition    - optional function that should return true when the action is
 *                allowed, false otherwise. It should generally be used to check
 *                if the action can modify game state (step #1 in ability
 *                resolution in the rules).
 * cost         - object or array of objects representing the cost required to
 *                be paid before the action will activate. See Costs.
 * phase        - string representing which phases the action may be executed.
 *                Defaults to 'any' which allows the action to be executed in
 *                any phase.
 * location     - string indicating the location the card should be in in order
 *                to activate the action. Defaults to 'play area'.
 * limit        - optional AbilityLimit object that represents the max number of
 *                uses for the action as well as when it resets.
 * max          - optional AbilityLimit object that represents the max number of
 *                times the ability by card title can be used. Contrast with
 *                `limit` which limits per individual card.
 * anyPlayer    - boolean indicating that the action may be executed by a player
 *                other than the card's controller. Defaults to false.
 * clickToActivate - boolean that indicates the action should be activated when
 *                   the card is clicked.
 */
class CardAction extends BaseAbility {
    constructor(game, card, properties) {
        super(properties);

        const DefaultLocationForType = {
            event: 'hand',
            agenda: 'agenda',
            plot: 'active plot'
        };

        this.game = game;
        this.card = card;
        this.title = properties.title;
        this.max = properties.max;
        this.phase = properties.phase || 'any';
        this.anyPlayer = properties.anyPlayer || false;
        this.condition = properties.condition;
        this.clickToActivate = !!properties.clickToActivate;
        this.location = properties.location || DefaultLocationForType[card.getType()] || 'play area';
        this.events = new EventRegistrar(game, this);
        this.activationContexts = [];

        this.handler = this.buildHandler(card, properties);

        if(card.getType() === 'event') {
            this.cost.push(Costs.playEvent());
        }

        if(this.max) {
            this.card.owner.registerAbilityMax(this.card.name, this.max);
        }
    }

    buildHandler(card, properties) {
        if(!properties.handler) {
            throw new Error('Actions must have a `handler` property.');
        }

        return properties.handler;
    }

    allowMenu() {
        return ['play area', 'agenda', 'active plot'].includes(this.location);
    }

    createContext(player) {
        return new AbilityContext({
            game: this.game,
            player: player,
            source: this.card
        });
    }

    meetsRequirements(context) {
        if(this.phase !== 'any' && this.phase !== this.game.currentPhase || this.game.currentPhase === 'setup') {
            return false;
        }

        if(!context.player.canTrigger(this.card)) {
            return false;
        }

        if(this.limit && this.limit.isAtMax()) {
            return false;
        }

        if(context.player !== this.card.controller && !this.anyPlayer) {
            return false;
        }

        if(this.card.getType() === 'event' && !context.player.isCardInPlayableLocation(this.card, 'play')) {
            return false;
        }

        if(this.card.getType() !== 'event' && this.location !== this.card.location) {
            return false;
        }

        if(this.card.isBlank()) {
            return false ;
        }

        if(this.condition && !this.condition()) {
            return false;
        }

        return this.canPayCosts(context) && this.canResolveTargets(context);
    }

    execute(player, arg) {
        var context = this.createContext(player, arg);

        if(!this.meetsRequirements(context)) {
            return false;
        }

        this.activationContexts.push(context);

        this.game.resolveAbility(this, context);

        return true;
    }

    executeHandler(context) {
        this.handler(context);
    }

    getMenuItem(arg) {
        return { text: this.title, method: 'doAction', anyPlayer: !!this.anyPlayer, arg: arg };
    }

    isAction() {
        return true;
    }

    isClickToActivate() {
        return this.clickToActivate;
    }

    isPlayableEventAbility() {
        return this.card.getPrintedType() === 'event' && this.location === 'hand';
    }

    hasMax() {
        return !!this.max;
    }

    deactivate(player) {
        var context = _.last(this.activationContexts);

        if(!context || player !== context.player) {
            return false;
        }

        if(this.canUnpayCosts(context)) {
            this.unpayCosts(context);
            context.abilityDeactivated = true;
            return true;
        }

        return false;
    }

    onBeginRound() {
        this.activationContexts = [];
    }

    isEventListeningLocation(location) {
        return this.location === location;
    }

    registerEvents() {
        this.events.register(['onBeginRound']);
        if(this.limit) {
            this.limit.registerEvents(this.game);
        }
    }

    unregisterEvents() {
        this.events.unregisterAll();
        if(this.limit) {
            this.limit.unregisterEvents(this.game);
        }
    }
}

module.exports = CardAction;
