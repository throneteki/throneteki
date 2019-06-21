const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class HandsOfGold extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.isMatch({
                    attackingPlayer: this.controller,
                    winner: this.controller,
                    challengeType: 'intrigue',
                    by5: true
                })
            },
            target: {
                cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.controller === this.game.currentChallenge.loser,
                gameAction: 'returnToHand'
            },
            message: '{player} plays {source} to return {target} to hand',
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.returnCardToHand(context => ({ card: context.target })),
                    context
                );
            }
        });
    }
}

HandsOfGold.code = '13050';

module.exports = HandsOfGold;
