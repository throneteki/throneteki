import DrawCard from '../../drawcard.js';

class DaenerysTargaryen extends DrawCard {
    // Daenerys Targaryen (01160)
    // Insight.
    // While Daenerys Targaryen is standing, each character participating on an opponent's side in a
    // challenge against you gets -1 STR.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => !this.kneeled,
            match: (card) => card.isParticipating() && card.getType() === 'character',
            targetController: 'opponent',
            effect: ability.effects.modifyStrength(-1)
        });
    }
}

DaenerysTargaryen.code = '01160';

export default DaenerysTargaryen;
