import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class QartheenGalleas extends DrawCard {
    // Qartheen Galleas (26074)
    // Shadow (1).
    // You are considered to have 1 fewer card in your hand.
    // Reaction: After Qartheen Galleas comes out of shadows, choose a card with shadow in your
    // discard pile and return it to your hand.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.modifyHandCount(-1)
        });
        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) => event.card === context.source
            },
            target: {
                cardCondition: {
                    location: 'discard pile',
                    controller: 'current',
                    condition: (card) => card.isShadow()
                }
            },
            message:
                '{player} uses {source} to return {target} to their hand from their discard pile',
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.target }))
        });
    }
}

QartheenGalleas.code = '26074';

export default QartheenGalleas;
