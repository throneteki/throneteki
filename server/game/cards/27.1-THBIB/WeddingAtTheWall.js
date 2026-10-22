import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WeddingAtTheWall extends DrawCard {
    // Wedding at the Wall (27002)
    // Shadow (0).
    // Reaction: After you win a [power] challenge as the attacking player, choose and stand 2
    // characters you control with the R'hllor or Wildling trait.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.isMatch({
                        challengeType: 'power',
                        winner: context.player,
                        attackingPlayer: context.player
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
                    (card.hasTrait("R'hllor") || card.hasTrait('Wildling')),
                gameAction: 'stand'
            },
            message: '{player} plays {source} to stand {target}',
            gameAction: GameActions.simultaneously((context) =>
                context.target.map((card) => GameActions.standCard({ card }))
            )
        });
    }
}

WeddingAtTheWall.code = '27002';

export default WeddingAtTheWall;
