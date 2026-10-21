import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Melisandre extends DrawCard {
    // Melisandre (14003)
    // Stealth.
    // Reaction: After you win an [intrigue] challenge in which Melisandre is attacking, move 1
    // power from a character controlled by the losing opponent to Melisandre. Then, if that
    // character has no power, kill it.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    this.isAttacking() &&
                    event.challenge.isMatch({ winner: this.controller, challengeType: 'intrigue' })
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.power > 0 &&
                    card.controller === context.event.challenge.loser,
                gameAction: 'movePower'
            },
            message: '{source} uses {source} to move 1 power from {target} to {source}',
            handler: (context) => {
                this.game
                    .resolveGameAction(
                        GameActions.movePower({
                            from: context.target,
                            to: this,
                            amount: 1
                        })
                    )
                    .thenExecute(() => {
                        if (!context.target.canBeKilled() || context.target.power > 0) {
                            return;
                        }

                        this.game.addMessage(
                            'Then {0} uses {1} to kill {2}',
                            context.player,
                            this,
                            context.target
                        );
                        this.game.killCharacter(context.target);
                    });
            }
        });
    }
}

Melisandre.code = '14003';

export default Melisandre;
