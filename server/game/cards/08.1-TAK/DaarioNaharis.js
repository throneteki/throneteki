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
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    context.source.isAttacking()
            },
            target: {
                cardCondition: {
                    type: 'character',
                    location: 'play area',
                    trait: ['Ally', 'Companion', 'Mercenary'],
                    condition: (card, context) => card !== context.source
                }
            },
            message:
                '{player} uses {source} to stand and take control of {target} until the end of the phase',
            gameAction: GameActions.simultaneously((context) => [
                GameActions.standCard((context) => ({ card: context.target })),
                GameActions.genericHandler((context) => {
                    context.source.untilEndOfPhase((ability) => ({
                        match: context.target,
                        effect: ability.effects.takeControl(context.player)
                    }));
                })
            ])
        });
    }
}

DaarioNaharis.code = '08014';

export default DaarioNaharis;
