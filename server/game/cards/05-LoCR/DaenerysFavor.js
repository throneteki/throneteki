import DrawCard from '../../drawcard.js';

class DaenerysFavor extends DrawCard {
    // Daenerys's Favor (05036)
    // [targaryen] character only.
    // While attached character is participating in a challenge, each other participating character
    // gets -1 STR.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'targaryen' });
        this.persistentEffect({
            condition: () => this.parent && this.parent.isParticipating(),
            match: (card) =>
                card.isParticipating() && card.getType() === 'character' && card !== this.parent,
            targetController: 'any',
            effect: ability.effects.modifyStrength(-1)
        });
    }
}

DaenerysFavor.code = '05036';

export default DaenerysFavor;
