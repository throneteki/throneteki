import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class ThereAreNoMenLikeMe extends DrawCard {
    // There Are No Men Like Me (07030)
    // Action: Choose a Knight character. Until the end of the phase, that character does not kneel
    // when declared as an attacker or defender in a [military] challenge.
    setupCardAbilities(ability) {
        this.action({
            title: "Select character that doesn't kneel for military challenges",
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.hasTrait('knight')
            },
            message:
                '{player} uses {source} to not kneel {target} when declared in military challenges this phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: [
                    ability.effects.doesNotKneelAsAttacker({ challengeType: 'military' }),
                    ability.effects.doesNotKneelAsDefender({ challengeType: 'military' })
                ]
            }))
        });
    }
}

ThereAreNoMenLikeMe.code = '07030';

export default ThereAreNoMenLikeMe;
