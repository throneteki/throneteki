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
                afterChallenge: (event, context) =>
                    event.challenge.isMatch({
                        attackingPlayer: context.source.controller,
                        winner: context.source.controller,
                        challengeType: 'intrigue',
                        by5: true
                    })
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === context.game.currentChallenge.loser,
                gameAction: 'returnToHand'
            },
            message: '{player} plays {source} to return {target} to hand',
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.target })),
            max: ability.limit.perChallenge(1)
        });
    }
}

HandsOfGold.code = '13050';

export default HandsOfGold;
