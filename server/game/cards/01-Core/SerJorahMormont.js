import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class SerJorahMormont extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && this.isParticipating()
            },
            message: '{player} is forced to place 1 betrayal token on {source}',
            handler: (context) => {
                this.game
                    .resolveGameAction(
                        GameActions.placeToken(() => ({ card: this, token: Tokens.betrayal })),
                        context
                    )
                    .thenExecute(() => {
                        if (this.tokens[Tokens.betrayal] >= 3) {
                            this.game.addMessage(
                                '{0} sacrifices {1} as it has 3 or more betrayal tokens',
                                context.player,
                                this
                            );
                            this.game.resolveGameAction(GameActions.sacrificeCard({ card: this }));
                        }
                    });
            }
        });
    }
}

SerJorahMormont.code = '01165';

export default SerJorahMormont;
