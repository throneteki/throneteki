import DrawCard from '../../drawcard.js';

class Queensguard extends DrawCard {
    // Queensguard (17173)
    // [targaryen] non-Lady character only. Shadow (2).
    // Action: Discard 1 [targaryen] card from your hand to stand attached character. (Limit twice
    // per round.)
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'targaryen', not: { trait: 'Lady' } });
        this.action({
            title: 'Stand attached character',
            condition: () => this.parent.kneeled,
            cost: ability.costs.discardFromHand((card) => card.isFaction('targaryen')),
            limit: ability.limit.perRound(2),
            handler: (context) => {
                context.player.standCard(this.parent);
                this.game.addMessage(
                    '{0} uses {1} and discards {2} from their hand to stand {3}',
                    context.player,
                    this,
                    context.costs.discardFromHand,
                    this.parent
                );
            }
        });
    }
}

Queensguard.code = '17173';

export default Queensguard;
