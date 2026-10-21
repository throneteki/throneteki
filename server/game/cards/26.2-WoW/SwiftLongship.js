import DrawCard from '../../drawcard.js';

class SwiftLongship extends DrawCard {
    // Swift Longship (26024)
    // Shadow (0).
    // Reaction: After Swift Longship comes out of shadows during a challenge, choose a defending
    // character with printed STR 4 or lower. That character does not contribute its STR to this
    // challenge.
    // +1 Initiative.
    setupCardAbilities() {
        this.plotModifiers({
            initiative: 1
        });
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
            },
            target: {
                cardCondition: {
                    location: 'play area',
                    type: 'character',
                    defending: true,
                    printedStrengthOrLower: 4
                }
            },
            message:
                "{player} uses {source} to have {target} not contribute it's STR to this challenge",
            handler: (context) => {
                this.untilEndOfChallenge((ability) => ({
                    match: context.target,
                    effect: ability.effects.doesNotContributeStrength()
                }));
            }
        });
    }
}

SwiftLongship.code = '26024';

export default SwiftLongship;
