import DrawCard from '../../drawcard.js';

class SilverHairNet extends DrawCard {
    // Silver Hair Net (06044)
    // Lady character only.
    // Attached character gains stealth.
    // While attached character is participating in a challenge, reduce the cost of each event you
    // play by 1.
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

export default SilverHairNet;
