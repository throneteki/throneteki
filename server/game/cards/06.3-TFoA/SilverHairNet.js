const DrawCard = require('../../drawcard.js');

class SilverHairNet extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Lady' });

        this.whileAttached({
            effect: ability.effects.addKeyword('stealth')
        });

        this.persistentEffect({
            condition: () => (
                this.game.currentChallenge &&
                this.game.currentChallenge.isParticipating(this.parent)
            ),
            targetType: 'player',
            targetController: 'current',
            effect: ability.effects.reduceCost({
                playingTypes: 'play',
                amount: 1,
                match: card => card.getType() === 'event'
            })
        });
    }
}

SilverHairNet.code = '06044';

module.exports = SilverHairNet;
