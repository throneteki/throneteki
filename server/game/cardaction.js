const _ = require('underscore');

/**
 * Represents an action ability provided by card text.
 *
 * Properties:
 * title        - string that is used within the card menu associated with this
 *                action.
 * cost         - object or array of objects representing the cost required to
 *                be paid before the action will activate. See Costs.
 * method       - string indicating the method on card that should be called
 *                when the action is executed. If this method returns an
 *                explicit `false` value then that execution of the action does
 *                not count toward the limit amount.
 * phase        - string representing which phases the action may be executed.
 *                Defaults to 'any' which allows the action to be executed in
 *                any phase.
 * limit        - optional AbilityLimit object that represents the max number of
 *                uses for the action as well as when it resets.
 * anyPlayer    - boolean indicating that the action may be executed by a player
 *                other than the card's controller. Defaults to false.
 */
class CardAction {
    constructor(game, card, properties) {
        this.game = game;
        this.card = card;
        this.title = properties.title;
        this.limit = properties.limit;
        this.phase = properties.phase || 'any';
        this.anyPlayer = properties.anyPlayer || false;
        this.cost = this.buildCost(properties.cost);

        this.handler = properties.handler || card[properties.method].bind(card);
    }

    buildCost(cost) {
        if(!cost) {
            return [];
        }

        if(!_.isArray(cost)) {
            return [cost];
        }

        return cost;
    }

    execute(player, arg) {
        var context = {
            arg: arg,
            game: this.game,
            player: player,
            source: this.card
        };

        if(this.phase !== 'any' && this.phase !== this.game.currentPhase || this.game.currentPhase === 'setup') {
            return;
        }

        if(this.limit && this.limit.isAtMax()) {
            return;
        }

        if(player !== this.card.controller && !this.anyPlayer) {
            return;
        }

        if(this.card.isBlank()) {
            return;
        }

        if(!_.all(this.cost, cost => cost.canPay(context))) {
            return;
        }

        _.each(this.cost, cost => {
            cost.pay(context);
        });

        if(this.handler(player, arg) !== false && this.limit) {
            this.limit.increment();
        }
    }

    getMenuItem() {
        return { text: this.title, method: 'doAction', anyPlayer: !!this.anyPlayer };
    }

    registerEvents() {
        if(this.limit) {
            this.limit.registerEvents(this.game);
        }
    }

    unregisterEvents() {
        if(this.limit) {
            this.limit.unregisterEvents(this.game);
        }
    }
}

module.exports = CardAction;
