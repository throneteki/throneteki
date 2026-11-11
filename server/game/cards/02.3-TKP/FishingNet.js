import DrawCard from '../../drawcard.js';

class FishingNet extends DrawCard {
    // Fishing Net (02052)
    // Opponent's character only.
    // Attached character cannot be declared as a defender.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'opponent' });
        this.whileAttached({
            effect: ability.effects.cannotBeDeclaredAsDefender()
        });
    }
}

FishingNet.code = '02052';

export default FishingNet;
