import DrawCard from '../../drawcard.js';

class StalwartShields extends DrawCard {
    // Stalwart Shields (24020)
    // Assault. No attachments.
    // While Stalwart Shields is participating in a challenge, each Army character an opponent
    // controls loses all keywords.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isParticipating(),
            match: (card) => card.controller !== this.controller && card.hasTrait('Army'),
            effect: ability.effects.losesAllKeywords()
        });
    }
}

StalwartShields.code = '24020';

export default StalwartShields;
