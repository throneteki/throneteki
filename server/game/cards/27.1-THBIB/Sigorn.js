import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Sigorn extends DrawCard {
    // Sigorn (27017)
    // Reaction: After you win a [military] challenge in which Sigorn is attacking, choose and stand
    // another Wildling character you control. Then, if that character was Alys Karstark, stand
    // Sigorn.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.isMatch({
                        challengeType: 'military',
                        winner: this.controller
                    }) && this.isAttacking()
            },
            target: {
                cardCondition: {
                    type: 'character',
                    location: 'play area',
                    controller: 'current',
                    trait: 'Wildling',
                    condition: (card) => card !== this && GameActions.standCard({ card }).allow()
                }
            },
            message: '{player} uses {source} to stand {target}',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.standCard({ card: context.target }).then({
                        condition: () =>
                            context.target.name === 'Alys Karstark' &&
                            GameActions.standCard({ card: this }).allow(),
                        message: 'Then, {player} stands {source}',
                        gameAction: GameActions.standCard({ card: this })
                    }),
                    context
                );
            }
        });
    }
}

Sigorn.code = '27017';

export default Sigorn;
