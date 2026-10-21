import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class DaarioNaharis extends DrawCard {
    // Daario Naharis (08014)
    // Renown.
    // Reaction: After you win a challenge in which Daario Naharis is attacking, choose another
    // Ally, Companion, or Mercenary character. Stand that character and take control of it until
    // the end of the phase.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && this.isAttacking()
            },
            target: {
                cardCondition: {
                    type: 'character',
                    location: 'play area',
                    trait: ['Ally', 'Companion', 'Mercenary'],
                    condition: (card) => card !== this
                }
            },
            message:
                '{player} uses {source} to stand and take control of {target} until the end of the phase',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.simultaneously([
                        GameActions.standCard((context) => ({ card: context.target })),
                        GameActions.genericHandler((context) => {
                            this.untilEndOfPhase((ability) => ({
                                match: context.target,
                                effect: ability.effects.takeControl(context.player)
                            }));
                        })
                    ]),
                    context
                );
            }
        });
    }
}

DaarioNaharis.code = '08014';

export default DaarioNaharis;
