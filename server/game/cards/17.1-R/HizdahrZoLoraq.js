import DrawCard from '../../drawcard.js';

class HizdahrZoLoraq extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce next marshal/ambush/out of shadows cost',
            cost: ability.costs.discardFromHand((card) => card.getType() === 'character'),
            limit: ability.limit.perRound(1),
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    targetController: 'current',
                    effect: ability.effects.reduceNextMarshalledAmbushedOrOutOfShadowsCardCost(3)
                }));

                this.game.addMessage(
                    '{0} uses {1} and discards {2} from to their hand to reduce the next card they marshal, ambush or bring out of shadows by 3',
                    context.player,
                    this,
                    context.costs.discardFromHand
                );
            }
        });
    }
}

HizdahrZoLoraq.code = '17130';

export default HizdahrZoLoraq;
