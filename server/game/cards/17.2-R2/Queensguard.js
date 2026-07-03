import DrawCard from '../../drawcard.js';

class Queensguard extends DrawCard {
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

Queensguard.code = '17212';

export default Queensguard;
