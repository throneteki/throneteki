import DrawCard from '../../drawcard.js';

class DaenerysFavor extends DrawCard {
    // Daenerys's Favor (05036)
    // [targaryen] character only.
    // While attached character is participating in a challenge, each other participating character
    // gets -1 STR.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'targaryen' });
        this.persistentEffect({
            condition: (context) =>
                context.source.parent && context.source.parent.isParticipating(),
            match: (card, context) =>
                card.isParticipating() &&
                card.getType() === 'character' &&
                card !== context.source.parent,
            targetController: 'any',
            effect: ability.effects.modifyStrength(-1)
        });
    }
}

DaenerysFavor.code = '05036';

export default DaenerysFavor;
