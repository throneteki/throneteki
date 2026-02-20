import DrawCard from '../../drawcard.js';

class TheOnlyGameThatMatters extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: "Remove character's strength",
            phase: 'challenge',
            target: {
                cardCondition: {
                    location: 'play area',
                    type: 'character',
                    defending: true,
                    condition: (card) => !card.hasIcon('intrigue')
                }
            },
            message: "{player} plays {source} to remove {target}'s STR from the challenge",
            handler: (context) => {
                this.untilEndOfChallenge((ability) => ({
                    match: context.target,
                    effect: ability.effects.doesNotContributeStrength()
                }));
            }
        });
    }
}

TheOnlyGameThatMatters.code = '27536';
TheOnlyGameThatMatters.version = '1.0.0';

export default TheOnlyGameThatMatters;
