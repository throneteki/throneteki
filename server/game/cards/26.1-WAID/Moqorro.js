import DrawCard from '../../drawcard.js';

class Moqorro extends DrawCard {
    // Moqorro (26003)
    // Shadow (2).
    // Reaction: After Moqorro comes out of shadows, choose a character. Until the end of the phase,
    // that character gains an [intrigue] icon and stealth.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
            },
            target: {
                cardCondition: { location: 'play area', type: 'character' }
            },
            message:
                '{player} uses {source} to to give {target} an intrigue icon and stealth until the end of the phase',
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: [
                        ability.effects.addIcon('intrigue'),
                        ability.effects.addKeyword('stealth')
                    ]
                }));
            }
        });
    }
}

Moqorro.code = '26003';

export default Moqorro;
