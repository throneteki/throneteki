import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class JonSnow extends DrawCard {
    // Jon Snow (25071)
    // No attachments except Direwolf.
    // Interrupt: When claim is applied for a [military] challenge, either: standing characters, or
    // kneeling characters must be chosen for claim during this challenge, if able.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onClaimApplied: (event) =>
                    event.challenge && event.challenge.isMatch({ challengeType: 'military' })
            },
            message:
                '{player} uses {source} to have either standing or kneeling characters satisfied for claim, if able',
            choices: {
                'Standing Characters': {
                    message:
                        '{player} chooses standing characters to be satisfied for claim, if able',
                    gameAction: mustChooseAsClaim(ability, false)
                },
                'Kneeling Characters': {
                    message:
                        '{player} chooses kneeling characters to be satisfied for claim, if able',
                    gameAction: mustChooseAsClaim(ability, true)
                }
            }
        });
    }
}

function mustChooseAsClaim(ability, kneeled) {
    return GameActions.lastingEffect((context) => ({
        duration: 'untilEndOfChallenge',
        targetController: 'any',
        match: context.game.allCards.filter(
            (card) => card.getType() === 'character' && card.kneeled === kneeled
        ),
        effect: ability.effects.mustChooseAsClaim()
    }));
}

JonSnow.code = '25071';

export default JonSnow;
