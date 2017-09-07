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
                onInsight: event => {
                    if(event.source.controller !== this.controller) {
                        return false;
                    }

                    // postpone the check about drawn card loyalty, to avoid
                    // leaking game state to the opponent
                    return true;
                }
            },
            handler: context => {
                let drawnCard = context.event.drawnCard;
                if(drawnCard.isLoyal()) {
                    this.controller.drawCardsToHand(1);

                    this.game.addMessage('{0} uses {1} to reveal {2} and draw a card',
                        this.controller, this, drawnCard);
                }
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
