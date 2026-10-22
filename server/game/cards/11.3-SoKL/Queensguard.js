import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Queensguard extends DrawCard {
    // Queensguard (11054)
    // Non-Lady character only. Shadow (2).
    // Action: Discard 1 card from your hand to stand attached character. (Limit 3 times per round.)
    setupCardAbilities(ability) {
        this.attachmentRestriction({ not: { trait: 'Lady' } });
        this.action({
            title: 'Stand attached character',
            condition: (context) => context.source.parent.kneeled,
            cost: ability.costs.discardFromHand(),
            limit: ability.limit.perRound(3),
            message: {
                format: '{player} uses {source} and discards {costs.discardFromHand} from their hand to stand {parent}',
                args: { parent: (context) => context.source.parent }
            },
            gameAction: GameActions.standCard((context) => ({ card: context.source.parent }))
        });
    }
}

Queensguard.code = '11054';

export default Queensguard;
