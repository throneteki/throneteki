import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TywinsStratagem extends DrawCard {
    // Tywin's Stratagem (06070)
    // Challenges Action: Choose a character with printed cost 2 or lower controlled by each player.
    // Return each of those characters to its owner's hand.
    // Reaction: After a character is discarded from an opponent's hand or deck, pay 1 gold to
    // return Tywin's Stratagem from your discard pile to your hand.
    setupCardAbilities(ability) {
        this.action({
            title: 'Return characters to hand',
            phase: 'challenge',
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getPrintedCost() <= 2,
                mode: 'eachPlayer',
                gameAction: 'returnToHand'
            },
            message: "{player} plays {source} to return {target} to its owner's hands",
            gameAction: GameActions.simultaneously((context) =>
                context.target.map((card) => GameActions.returnCardToHand({ card }))
            )
        });
        this.reaction({
            location: 'discard pile',
            when: {
                onCardDiscarded: (event, context) =>
                    context.player !== event.cardStateWhenDiscarded.controller &&
                    ['hand', 'draw deck'].includes(event.cardStateWhenDiscarded.location) &&
                    event.card.getType() === 'character'
            },
            ignoreEventCosts: true,
            cost: ability.costs.payGold(1),
            message: '{player} pays 1 gold to return {source} to their hand',
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.source }))
        });
    }
}

TywinsStratagem.code = '06070';

export default TywinsStratagem;
