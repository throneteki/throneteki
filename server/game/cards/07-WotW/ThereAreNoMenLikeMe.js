import DrawCard from '../../drawcard.js';

class ThereAreNoMenLikeMe extends DrawCard {
    // There Are No Men Like Me (07030)
    // Action: Choose a Knight character. Until the end of the phase, that character does not kneel
    // when declared as an attacker or defender in a [military] challenge.
    setupCardAbilities() {
        this.action({
            title: "Select character that doesn't kneel for military challenges",
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.hasTrait('knight')
            },
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: [
                        ability.effects.doesNotKneelAsAttacker({ challengeType: 'military' }),
                        ability.effects.doesNotKneelAsDefender({ challengeType: 'military' })
                    ]
                }));

                this.game.addMessage(
                    '{0} uses {1} to not kneel {2} when declared in military challenges this phase',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

ThereAreNoMenLikeMe.code = '07030';

export default ThereAreNoMenLikeMe;
