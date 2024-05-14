import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class KingRobertsLegacy extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    this.controller.anyCardsInPlay({
                        attacking: true,
                        trait: 'King',
                        type: 'character'
                    })
            },
            target: {
                cardCondition: {
                    participating: true,
                    kneeled: true,
                    type: 'character',
                    controller: 'opponent'
                },
                gameAction: 'takeControl'
            },
            max: ability.limit.perRound(1),
            message: '{player} uses {source} to take control of {target}',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.takeControl((context) => ({
                        player: this.controller,
                        card: context.target,
                        context
                    })),
                    context
                );
            }
        });
    }
}

KingRobertsLegacy.code = '25022';

export default KingRobertsLegacy;
