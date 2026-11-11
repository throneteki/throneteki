import DrawCard from '../../drawcard.js';

class TheShieldIslands extends DrawCard {
    // The Shield Islands (12038)
    // Increase the number of cards each player draws in the draw phase by 1.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.modifyDrawPhaseCards(1)
        });
    }
}

TheShieldIslands.code = '12038';

export default TheShieldIslands;
