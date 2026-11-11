import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class PayTheIronPrice extends DrawCard {
    // Pay The Iron Price (06112)
    // Challenges Action: Choose an attachment in an opponent's discard pile, and put it into play
    // under your control.
    // Reaction: After you win an unopposed challenge, pay 1 gold to return Pay The Iron Price from
    // your discard pile to your hand.
    setupCardAbilities(ability) {
        this.action({
            title: 'Put attachment into play',
            phase: 'challenge',
            target: {
                activePromptTitle: 'Select an attachment',
                cardCondition: (card, context) =>
                    card.location === 'discard pile' &&
                    card.controller !== context.player &&
                    card.getType() === 'attachment'
            },
            message: {
                format: "{player} plays {source} to put {target} into play from {owner}'s discard pile under their control",
                args: { owner: (context) => context.target.owner }
            },
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.target
            }))
        });
        this.reaction({
            location: 'discard pile',
            when: {
                afterChallenge: (event, context) =>
                    context.player === event.challenge.winner && event.challenge.isUnopposed()
            },
            ignoreEventCosts: true,
            cost: ability.costs.payGold(1),
            message: '{player} pays 1 gold to return {source} to their hand',
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.source }))
        });
    }
}

PayTheIronPrice.code = '06112';

export default PayTheIronPrice;
