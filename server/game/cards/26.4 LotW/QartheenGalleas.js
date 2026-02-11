import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class QartheenGalleas extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.modifyHandCount(-1)
        });
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
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
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.returnCardToHand((context) => ({ card: context.target })),
                    context
                );
            }
        });
    }
}

QartheenGalleas.code = '26074';

export default QartheenGalleas;
