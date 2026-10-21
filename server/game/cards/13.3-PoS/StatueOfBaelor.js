import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class StatueOfBaelor extends DrawCard {
    // Statue of Baelor (13058)
    // Action: Kneel Statue of Baelor and discard 1 power from another character or location you
    // control to stand that character or location.
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand card',
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.discardPower(
                    1,
                    (card) =>
                        card !== this &&
                        ['character', 'location'].includes(card.getType()) &&
                        card.kneeled &&
                        card.allowGameAction('stand')
                )
            ],
            message: {
                format: '{player} kneels {source} and discards 1 power from {discardPower} to stand {discardPower}',
                args: { discardPower: (context) => context.costs.discardPower }
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.standCard((context) => ({ card: context.costs.discardPower })),
                    context
                );
            }
        });
    }
}

StatueOfBaelor.code = '13058';

export default StatueOfBaelor;
