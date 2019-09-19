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
                onCardsDrawn: event =>
                    event.reason === 'insight' &&
                    event.source.controller === this.controller &&
                    event.cards[0].isLoyal() &&
                    this.controller.canDraw()
            },
            cost: ability.costs.revealSpecific(context => context.event.cards[0]),
            handler: context => {
                this.controller.drawCardsToHand(1);
                this.game.addMessage('{0} uses {1} to draw 1 card', context.player, this);
            }
        });
    }

    anyOpponentControlsKing() {
        return this.game.getPlayers().some(player => {
            if(player === this.controller) {
                return false;
            }

            return player.anyCardsInPlay(card => card.getType() === 'character' && card.hasTrait('King'));
        });
    }
}

RenlyBaratheon.code = '04043';

module.exports = RenlyBaratheon;
