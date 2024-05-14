import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class StatueOfBaelor extends DrawCard {
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
