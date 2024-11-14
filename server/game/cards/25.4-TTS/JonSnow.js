import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class JonSnow extends DrawCard {
    setupCardAbilities() {
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
                    gameAction: this.mustChooseClaimGameAction(false)
                },
                'Kneeling Characters': {
                    message:
                        '{player} chooses kneeling characters to be satisfied for claim, if able',
                    gameAction: this.mustChooseClaimGameAction(true)
                }
            }
        });
    }

    mustChooseClaimGameAction(kneeled) {
        return GameActions.genericHandler(() => {
            const affectedChars = this.game.allCards.filter(
                (card) => card.getType() === 'character' && card.kneeled === kneeled
            );
            this.untilEndOfChallenge((ability) => ({
                targetController: 'any',
                match: affectedChars,
                effect: ability.effects.mustChooseAsClaim()
            }));
        });
    }
}

JonSnow.code = '25071';

export default JonSnow;
