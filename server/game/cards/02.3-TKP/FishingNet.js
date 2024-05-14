import DrawCard from '../../drawcard.js';

class FishingNet extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'opponent' });
        this.whileAttached({
            effect: ability.effects.cannotBeDeclaredAsDefender()
        });
    }
}

FishingNet.code = '02052';

export default FishingNet;
