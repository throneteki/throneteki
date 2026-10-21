import PlotCard from '../../plotcard.js';

class TheWatchNeedsGoodMen extends PlotCard {
    // The Watch Needs Good Men (25070)
    // You may marshal or ambush characters from any opponent's discard pile as if they were in your
    // hand.
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
