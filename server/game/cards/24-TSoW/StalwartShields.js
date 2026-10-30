import DrawCard from '../../drawcard.js';

class StalwartShields extends DrawCard {
    // Stalwart Shields (24020)
    // Assault. No attachments.
    // While Stalwart Shields is participating in a challenge, each Army character an opponent
    // controls loses all keywords.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.isParticipating(),
            targetController: 'opponent',
            match: (card, context) =>
                card.controller !== context.source.controller && card.hasTrait('Army'),
            effect: ability.effects.losesAllKeywords()
        });
    }
}

StalwartShields.code = '24020';

export default StalwartShields;
