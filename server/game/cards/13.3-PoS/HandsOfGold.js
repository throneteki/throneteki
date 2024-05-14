const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class HandsOfGold extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.isMatch({
                        attackingPlayer: this.controller,
                        winner: this.controller,
                        challengeType: 'intrigue',
                        by5: true
                    })
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === this.game.currentChallenge.loser,
                gameAction: 'returnToHand'
            },
            message: '{player} plays {source} to return {target} to hand',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.returnCardToHand((context) => ({ card: context.target })),
                    context
                );
            },
            max: ability.limit.perChallenge(1)
        });
    }
}

HandsOfGold.code = '13050';

module.exports = HandsOfGold;
