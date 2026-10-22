import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Queensguard extends DrawCard {
    // Queensguard (17173)
    // [targaryen] non-Lady character only. Shadow (2).
    // Action: Discard 1 [targaryen] card from your hand to stand attached character. (Limit twice
    // per round.)
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'targaryen', not: { trait: 'Lady' } });
        this.action({
            title: 'Stand attached character',
            condition: (context) => context.source.parent.kneeled,
            cost: ability.costs.discardFromHand((card) => card.isFaction('targaryen')),
            limit: ability.limit.perRound(2),
            message: {
                format: '{player} uses {source} and discards {costs.discardFromHand} from their hand to stand {parent}',
                args: { parent: (context) => context.source.parent }
            },
            gameAction: GameActions.standCard((context) => ({ card: context.source.parent }))
        });
    }
}

Queensguard.code = '17173';

export default Queensguard;
