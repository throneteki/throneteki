import DrawCard from '../../drawcard.js';

class VisitedByShadows extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'opponent' });
        this.whileAttached({
            effect: ability.effects.modifyStrength(-1)
        });
    }
}

VisitedByShadows.code = '04048';

export default VisitedByShadows;
