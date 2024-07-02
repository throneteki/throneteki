import PlotCard from '../../plotcard.js';

class TheWatchNeedsGoodMen extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: [
                ability.effects.canMarshal(this.characterCondition),
                ability.effects.canAmbush(this.characterCondition)
            ]
        });
    }

    characterCondition(card) {
        return (
            card.controller !== this.controller &&
            card.location === 'discard pile' &&
            card.getType() === 'character'
        );
    }
}

TheWatchNeedsGoodMen.code = '25070';

export default TheWatchNeedsGoodMen;
