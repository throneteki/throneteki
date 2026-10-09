import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WeddingAtTheWall extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.isMatch({
                        challengeType: 'power',
                        winner: this.controller,
                        attackingPlayer: this.controller
                    })
            },
            target: {
                mode: 'exactly',
                numCards: 2,
                activePromptTitle: 'Select 2 characters',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === context.player &&
                    (card.hasTrait("R'hllor") || card.hasTrait('Wildling')) &&
                    GameActions.standCard({ card }).allow()
            },
            message: '{player} plays {source} to stand {target}',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.simultaneously(
                        context.target.map((card) => GameActions.standCard({ card }))
                    ),
                    context
                );
            }
        });
    }
}

WeddingAtTheWall.code = '27002';

export default WeddingAtTheWall;
