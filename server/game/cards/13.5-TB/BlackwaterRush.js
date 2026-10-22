import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BlackwaterRush extends DrawCard {
    // Blackwater Rush (13088)
    // Shadow (2).
    // Reaction: After a card you control comes out of shadows, kneel Blackwater Rush to choose a
    // [baratheon] character. That character gains 1 power.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) =>
                    event.card.controller === context.source.controller
            },
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isFaction('baratheon') &&
                    card.canGainPower()
            },
            message: '{player} kneels {source} to have {target} gain one power.',
            gameAction: GameActions.gainPower((context) => ({ card: context.target, amount: 1 }))
        });
    }
}

BlackwaterRush.code = '13088';

export default BlackwaterRush;
