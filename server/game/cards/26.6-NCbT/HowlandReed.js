import DrawCard from '../../drawcard.js';

class HowlandReed extends DrawCard {
    // Howland Reed (26111)
    // Stealth.
    // Reduce the cost of the first [stark] card you bring out of shadows each round by 2.
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
