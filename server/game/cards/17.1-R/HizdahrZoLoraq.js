import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class HizdahrZoLoraq extends DrawCard {
    // Hizdahr zo Loraq (17130)
    // Action: Discard 1 character card from your hand to reduce the cost of the next card you
    // marshal, ambush, or bring out of shadows this phase by 3. (Limit once per round.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce next marshal/ambush/out of shadows cost',
            cost: ability.costs.discardFromHand((card) => card.getType() === 'character'),
            limit: ability.limit.perRound(1),
            message:
                '{player} uses {source} and discards {costs.discardFromHand} from their hand to reduce the next card they marshal, ambush or bring out of shadows by 3',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                targetController: 'current',
                effect: ability.effects.reduceNextMarshalledAmbushedOrOutOfShadowsCardCost(3)
            }))
        });
    }
}

HizdahrZoLoraq.code = '17130';

export default HizdahrZoLoraq;
