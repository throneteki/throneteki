import DrawCard from '../../drawcard.js';

class CroneOfVaesDothrak extends DrawCard {
    // Crone of Vaes Dothrak (02053)
    // Reaction: After a character is discarded from an opponent's hand or deck, kneel a Dothraki
    // character to place that card in its owner's dead pile.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDiscarded: (event) =>
                    (event.originalLocation === 'hand' || event.originalLocation === 'draw deck') &&
                    event.card.getType() === 'character' &&
                    event.card.controller !== this.controller &&
                    event.card.location === 'discard pile'
            },
            cost: ability.costs.kneel(
                (card) => card.getType() === 'character' && card.hasTrait('Dothraki')
            ),
            handler: (context) => {
                let discardedCard = context.event.card;
                discardedCard.owner.moveCard(discardedCard, 'dead pile');

                this.game.addMessage(
                    '{0} uses {1} to place {2} in the dead pile',
                    this.controller,
                    this,
                    discardedCard
                );
            }
        });
    }
}

CroneOfVaesDothrak.code = '02053';

export default CroneOfVaesDothrak;
