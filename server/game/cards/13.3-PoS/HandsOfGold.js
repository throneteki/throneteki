import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class HandsOfGold extends DrawCard {
    // "Hands of Gold" (13050)
    // Reaction: After you win an [intrigue] challenge by 5 or more STR as the attacking player,
    // choose a character controlled by the losing opponent and return it to its owner's hand. (Max
    // 1 per challenge.)
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

export default HandsOfGold;
