import AbilityContext from './AbilityContext.js';
import BaseAbility from './baseability.js';
import Costs from './costs.js';
import EventRegistrar from './eventregistrar.js';

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
        this.phase = this.buildPhase(properties);
        this.anyPlayer = properties.anyPlayer || false;
        this.condition = properties.condition;
        this.clickToActivate = !!properties.clickToActivate;
        this.location =
            properties.location || DefaultLocationForType[card.getPrintedType()] || 'play area';
        this.events = new EventRegistrar(game, this);
        this.activationContexts = [];

        if (card.getPrintedType() === 'event') {
            this.cost = this.cost.concat(Costs.playEvent());
        }

        if (this.max) {
            this.card.owner.registerAbilityMax(this.card.name, this.max);
        }

        if (!this.gameAction) {
            throw new Error('Actions must have a `gameAction` or `handler` property.');
        }
    }

    buildPhase(properties) {
        if (!properties.phase) {
            return 'any';
        }

        if (
            ![
                'any',
                'plot',
                'draw',
                'marshal',
                'challenge',
                'dominance',
                'standing',
                'taxation'
            ].includes(properties.phase)
        ) {
            throw new Error(`'${properties.phase}' is not a valid 'phase' property`);
        }

        return properties.phase;
    }

    allowMenu() {
        return (
            ['play area', 'agenda', 'active plot'].includes(this.location) &&
            this.card.getPrintedType() !== 'event' &&
            !this.card.facedown
        );
    }

    allowPlayer(player) {
        return this.card.controller === player || this.anyPlayer;
    }

    createContext(player) {
        return new AbilityContext({
            ability: this,
            game: this.game,
            player: player,
            source: this.card
        });
    }

    meetsRequirements(context) {
        if (
            (this.phase !== 'any' && this.phase !== this.game.currentPhase) ||
            this.game.currentPhase === 'setup'
        ) {
            return false;
        }

        if (this.isCardAbility() && !context.player.canTrigger(this)) {
            return false;
        }

        if (this.limit && this.limit.isAtMax()) {
            return false;
        }

        if (this.max && context.player.isAbilityAtMax(context.source.name)) {
            return false;
        }

        if (!this.allowPlayer(context.player)) {
            return false;
        }

        if (
            this.card.getPrintedType() === 'event' &&
            !context.player.isCardInPlayableLocation(this.card, 'play')
        ) {
            return false;
        }

        if (this.card.getPrintedType() !== 'event' && this.location !== this.card.location) {
            return false;
        }

        if (this.card.isAnyBlank()) {
            return false;
        }

        if (this.condition && !this.condition(context)) {
            return false;
        }

        if (this.card.getPrintedType() !== 'event' && this.card.facedown) {
            return false;
        }

        return (
            this.canResolvePlayer(context) &&
            this.canPayCosts(context) &&
            this.canResolveTargets(context) &&
            this.gameAction.allow(context)
        );
    }

    execute(player, arg) {
        var context = this.createContext(player, arg);

        if (!this.meetsRequirements(context)) {
            return false;
        }

        this.activationContexts.push(context);

        this.game.resolveAbility(this, context);

        return true;
    }

    getMenuItem(arg, player) {
        let context = this.createContext(player);
        return {
            text: this.title,
            method: 'doAction',
            arg: arg,
            anyPlayer: !!this.anyPlayer,
            disabled: !this.meetsRequirements(context)
        };
    }

    isAction() {
        return true;
    }

    isTriggeredAbility() {
        return true;
    }

    isClickToActivate() {
        return this.clickToActivate;
    }

    isPlayableEventAbility() {
        return this.card.getPrintedType() === 'event' && this.location === 'hand';
    }

    incrementLimit() {
        if (this.location !== this.card.location) {
            return;
        }

        super.incrementLimit();
    }

    hasMax() {
        return !!this.max;
    }

    deactivate(player) {
        if (this.activationContexts.length === 0) {
            return false;
        }

        var context = this.activationContexts[this.activationContexts.length - 1];

        if (!context || player !== context.player) {
            return false;
        }

        if (this.canUnpayCosts(context)) {
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
        if (this.limit) {
            this.limit.registerEvents(this.game);
        }
    }

    unregisterEvents() {
        this.events.unregisterAll();
        if (this.limit) {
            this.limit.unregisterEvents(this.game);
        }
    }
}

export default CardAction;
