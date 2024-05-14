import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TywinsStratagem extends DrawCard {
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
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.simultaneously((context) =>
                        context.target.map((card) => GameActions.returnCardToHand({ card }))
                    ),
                    context
                );
            }
        });

        this.reaction({
            location: 'discard pile',
            when: {
                onCardDiscarded: (event) =>
                    this.controller !== event.cardStateWhenDiscarded.controller &&
                    ['hand', 'draw deck'].includes(event.cardStateWhenDiscarded.location) &&
                    event.card.getType() === 'character'
            },
            ignoreEventCosts: true,
            cost: ability.costs.payGold(1),
            handler: () => {
                this.game.addMessage(
                    '{0} pays 1 gold to move {1} back to their hand',
                    this.controller,
                    this
                );
                this.controller.moveCard(this, 'hand');
            }
        });
    }
}

TywinsStratagem.code = '06070';

export default TywinsStratagem;
