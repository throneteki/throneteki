import PlotCard from '../../plotcard.js';

class JoustingContest extends PlotCard {
    // Jousting Contest (01014)
    // Each player cannot declare more than 1 character as an attacker or defender in each
    // challenge.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: [ability.effects.setAttackerMaximum(1), ability.effects.setDefenderMaximum(1)]
        });
    }
}

JoustingContest.code = '01014';

export default JoustingContest;
