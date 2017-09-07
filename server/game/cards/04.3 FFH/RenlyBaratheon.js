const _ = require('underscore');

const DrawCard = require('../../drawcard.js');

class RenlyBaratheon extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.anyOpponentControlsKing(),
            match: this,
            effect: ability.effects.cannotBeSaved()
        });

        this.reaction({
            when: {
                onInsight: event => event.source.controller === this.controller && event.card.isLoyal()
            },
            cost: ability.costs.revealSpecific(context => context.event.card),
            handler: context => {
                this.controller.drawCardsToHand(1);
                this.game.addMessage('{0} uses {1} to draw 1 card', this.controller, this, context.event.card);
            }
        });
    }

    anyOpponentControlsKing() {
        return _.any(this.game.getPlayers(), player => {
            if(player === this.controller) {
                return false;
            }

            return player.anyCardsInPlay(card => card.getType() === 'character' && card.hasTrait('King'));
        });
    }
}

RenlyBaratheon.code = '04043';

module.exports = RenlyBaratheon;
