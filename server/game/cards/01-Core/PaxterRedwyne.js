import DrawCard from '../../drawcard.js';

class PaxterRedwyne extends DrawCard {
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
