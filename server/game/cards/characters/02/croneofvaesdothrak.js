const DrawCard = require('../../../drawcard.js');

class CroneOfVaesDothrak extends DrawCard {

    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDiscarded: (event, params) =>
                    ((params.originalLocation === 'hand' || params.originalLocation === 'draw deck')
                     && params.card.getType() === 'character'
                     && params.player !== this.controller)
            },
            cost: ability.costs.kneel(card => (
                card.getType() === 'character' && card.hasTrait('Dothraki')
            )),
            handler: (context) => {
                var discardedCard = context.event.params[1].card;
                var otherPlayer = this.game.getOtherPlayer(this.controller);
                if(!otherPlayer) {
                    return true;
                }

                otherPlayer.moveCard(discardedCard, 'dead pile');

                this.game.addMessage('{0} uses {1} to place {2} in the dead pile',
                                     this.controler, this, discardedCard);
            }
        });
    }
}

CroneOfVaesDothrak.code = '02053';

module.exports = CroneOfVaesDothrak;
