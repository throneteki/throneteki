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
                afterChallenge: (event, context) =>
                    event.challenge.isMatch({
                        challengeType: 'military',
                        winner: context.source.controller
                    }) && context.source.isAttacking()
            },
            target: {
                cardCondition: {
                    type: 'character',
                    location: 'play area',
                    controller: 'current',
                    trait: 'Wildling',
                    condition: (card, context) =>
                        card !== context.source && GameActions.standCard({ card }).allow()
                }
            },
            message: '{player} uses {source} to stand {target}',
            gameAction: GameActions.standCard((context) => ({ card: context.target })).then(
                (context) => ({
                    condition: () =>
                        context.target.name === 'Alys Karstark' &&
                        GameActions.standCard({ card: context.source }).allow(),
                    message: 'Then, {player} stands {source}',
                    gameAction: GameActions.standCard({ card: context.source })
                })
            )
        });
    }
}

Sigorn.code = '27017';

export default Sigorn;
