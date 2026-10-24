import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class RenlyBaratheon extends DrawCard {
    // Renly Baratheon (14004)
    // Renown.
    // Action: Kneel your faction card to put a non-[baratheon] character with printed cost X or
    // lower into play from your hand. X is Renly Baratheon's STR.
    setupCardAbilities(ability) {
        this.action({
            title: 'Put character into play',
            cost: ability.costs.kneelFactionCard(),
            target: {
                cardCondition: (card, context) =>
                    card.controller === context.source.controller &&
                    card.location === 'hand' &&
                    card.getType() === 'character' &&
                    !card.isFaction('baratheon') &&
                    card.getPrintedCost() <= context.source.getStrength() &&
                    context.source.controller.canPutIntoPlay(card)
            },
            message:
                '{player} uses {source} and kneels their faction card to put {target} into play',
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.target
            }))
        });
    }
}

RenlyBaratheon.code = '14004';

export default RenlyBaratheon;
