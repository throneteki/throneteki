const DrawCard = require('../../drawcard.js');

class SilverHairNet extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Lady' });

        this.whileAttached({
            effect: ability.effects.addKeyword('stealth')
        });

        this.persistentEffect({
            condition: () => this.parent && this.parent.isParticipating(),
            targetController: 'current',
            effect: ability.effects.reduceCost({
                playingTypes: 'play',
                amount: 1,
                match: (card) => card.getType() === 'event'
            })
        });
    }
}

SilverHairNet.code = '06044';

module.exports = SilverHairNet;
