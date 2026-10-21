import DrawCard from '../../drawcard.js';

class PaxterRedwyne extends DrawCard {
    // Paxter Redwyne (01182)
    // Reduce the cost of the first event you play each round by 1.
    // +1 Income.
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 1
        });
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.reduceFirstPlayedCardCostEachRound(
                1,
                (card) => card.getType() === 'event'
            )
        });
    }
}

PaxterRedwyne.code = '01182';

export default PaxterRedwyne;
