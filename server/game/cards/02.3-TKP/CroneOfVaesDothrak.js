import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class CroneOfVaesDothrak extends DrawCard {
    // Crone of Vaes Dothrak (02053)
    // Reaction: After a character is discarded from an opponent's hand or deck, kneel a Dothraki
    // character to place that card in its owner's dead pile.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDiscarded: (event, context) =>
                    (event.originalLocation === 'hand' || event.originalLocation === 'draw deck') &&
                    event.card.getType() === 'character' &&
                    event.card.controller !== context.player &&
                    event.card.location === 'discard pile'
            },
            cost: ability.costs.kneel(
                (card) => card.getType() === 'character' && card.hasTrait('Dothraki')
            ),
            message: {
                format: '{player} uses {source} to place {card} in the dead pile',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.placeCard((context) => ({
                card: context.event.card,
                location: 'dead pile'
            }))
        });
    }
}

CroneOfVaesDothrak.code = '02053';

export default CroneOfVaesDothrak;
