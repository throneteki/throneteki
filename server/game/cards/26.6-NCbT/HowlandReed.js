import DrawCard from '../../drawcard.js';

class HowlandReed extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.reduceFirstOutOfShadowsCardCostEachRound(2, (card) =>
                card.isFaction('stark')
            )
        });
    }
}

HowlandReed.code = '26111';

export default HowlandReed;
