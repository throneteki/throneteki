import DrawCard from '../../drawcard.js';

class TheHighSparrow extends DrawCard {
    // The High Sparrow (08097)
    // Each player cannot gain more than 7 gold each round.
    // Each player cannot draw more than 3 cards each round.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: [ability.effects.setMaxGoldGain(7), ability.effects.setMaxCardDraw(3)]
        });
    }
}

TheHighSparrow.code = '08097';

export default TheHighSparrow;
