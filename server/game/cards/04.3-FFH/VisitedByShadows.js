import DrawCard from '../../drawcard.js';

class VisitedByShadows extends DrawCard {
    // Visited by Shadows (04048)
    // Opponent's character only.
    // Attached character gets -1 STR.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'opponent' });
        this.whileAttached({
            effect: ability.effects.modifyStrength(-1)
        });
    }
}

VisitedByShadows.code = '04048';

export default VisitedByShadows;
