import DrawCard from '../../drawcard.js';

class Confinement extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Remove icons from character',
            target: {
                cardCondition: (card) => this.cardCondition(card)
            },
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: [
                        ability.effects.removeIcon('military'),
                        ability.effects.removeIcon('intrigue'),
                        ability.effects.removeIcon('power')
                    ]
                }));

                this.game.addMessage(
                    '{0} plays {1} to remove a {2}, an {3} and a {4} from {5} until the end of the phase',
                    this.controller,
                    this,
                    'military',
                    'intrigue',
                    'power',
                    context.target
                );
            }
        });
    }

    cardCondition(card) {
        return (
            card.location === 'play area' &&
            card.getType() === 'character' &&
            card.getStrength() <= 4
        );
    }
}

Confinement.code = '01121';

export default Confinement;
