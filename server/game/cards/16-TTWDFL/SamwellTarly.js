const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class SamwellTarly extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Look at top 4 cards',
            cost: ability.costs.kneelSelf(),
            message: '{player} kneels {source} to look at the top 4 cards of their deck',
            gameAction: GameActions.lookAtDeck(context => ({
                player: context.player,
                lookingAt: context.player,
                amount: 4
            })).then({
                targets: {
                    cardInDeck: {
                        type: 'select',
                        activePromptTitle: 'Select a card',
                        cardCondition: (card, context) => context.event.topCards.includes(card),
                        revealTargets: true
                    },
                    cardInHand: {
                        type: 'select',
                        ifAble: true,
                        activePromptTitle: 'Select a card',
                        cardCondition: { location: 'hand', controller: 'current' }
                    }
                },
                handler: thenContext => {
                    if(thenContext.targets.cardInHand) {
                        this.game.addMessage('{0} swaps a card from hand with a card in their deck', thenContext.player);
                        this.game.resolveGameAction(
                            GameActions.simultaneously([
                                GameActions.placeCard({ card: thenContext.targets.cardInHand, location: 'draw deck'}),
                                GameActions.placeCard({ card: thenContext.targets.cardInDeck, location: 'hand' })
                            ])
                        );
                    }
                }
            }).then({
                message: 'Then, {player} reorders the top cards of their deck',
                gameAction: GameActions.simultaneously(context => 
                    context.player.drawDeck.slice(0, 4).map(card => GameActions.placeCard({ card, location: 'draw deck' }))
                )
            })
        });
    }
}

SamwellTarly.code = '16009';

module.exports = SamwellTarly;
