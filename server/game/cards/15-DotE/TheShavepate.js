import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheShavepate extends DrawCard {
    // The Shavepate (15008)
    // Challenges Action: Pay X gold to put a character with printed cost X or lower into play from
    // your discard pile. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Put character into play',
            phase: 'challenge',
            cost: ability.costs.payXGold(
                () => 0,
                () => 99
            ),
            target: {
                type: 'select',
                cardCondition: (card, context) =>
                    card.location === 'discard pile' &&
                    card.getType() === 'character' &&
                    card.controller === context.player &&
                    context.player.canPutIntoPlay(card) &&
                    card.getPrintedCost() <= (context.xValue ?? context.player.getSpendableGold())
            },
            message:
                '{player} uses {source} and pays {costs.gold} gold to put {target} into play from their discard pile',
            gameAction: GameActions.putIntoPlay((context) => ({ card: context.target })),
            limit: ability.limit.perPhase(1)
        });
    }
}

TheShavepate.code = '15008';

export default TheShavepate;
