import DrawCard from '../../drawcard.js';

class HarmenUller extends DrawCard {
    // Harmen Uller (04016)
    // Renown.
    // Each Sand Snake character in your hand gains ambush (X). X is 1 less than that card's printed
    // cost.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetLocation: 'hand',
            match: (card) => card.hasTrait('Sand Snake'),
            effect: ability.effects.gainAmbush(-1)
        });
    }
}

HarmenUller.code = '04016';

export default HarmenUller;
