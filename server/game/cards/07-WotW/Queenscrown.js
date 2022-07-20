const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class Queenscrown extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reveal top 3 cards of opponent\'s deck',
            cost: ability.costs.kneelSelf(),
            chooseOpponent: true,
            message: '{player} kneels {costs.kneel} to reveal the top 3 cards of {opponent}\'s deck',
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.revealTopCards(context => ({
                        player: context.opponent,
                        amount: 3,
                        whileRevealed: GameActions.genericHandler(context => {
                            this.chooseDiscard(context);
                        })
                    })).then(context => ({
                        handler: () => {
                            if(context.target) {
                                this.game.addMessage('{0} discards {1} from {2}\'s deck', context.player, context.target, context.opponent);
                                this.game.resolveGameAction(
                                    GameActions.discardCard(context => ({
                                        card: context.target
                                    })),
                                    context
                                );
                            }

                            if(context.orderedBottomCards.length > 0) {
                                this.game.addMessage('{0} places {1} cards on the bottom of {2}\'s draw deck', context.player, context.orderedBottomCards.length, context.opponent);
                                this.game.resolveGameAction(
                                    GameActions.simultaneously(context => context.orderedBottomCards.map(card => (
                                        GameActions.placeCard({
                                            card,
                                            player: context.opponent,
                                            location: 'draw deck',
                                            bottom: true
                                        })
                                    ))),
                                    context
                                );
                            }
                        }
                    })),
                    context
                );
            }
        });
    }

    chooseDiscard(context) {
        const isCharacter = card => card.getType() === 'character';
        if(context.revealed.some(isCharacter)) {
            this.game.promptForSelect(context.player, {
                activePromptTitle: 'Select a character',
                cardCondition: card => context.revealed.includes(card) && isCharacter(card),
                onSelect: (player, card) => {
                    context.target = card;
                    this.chooseBottomOrder(context);
                    return true;
                },
                onCancel: () => {
                    this.chooseBottomOrder(context);
                    return true;
                }
            });
        } else {
            this.chooseBottomOrder(context);
        }
    }

    chooseBottomOrder(context) {
        const remainingCards = context.revealed.filter(card => card !== context.target);
        if(remainingCards.length > 0) {
            this.game.promptForSelect(context.player, {
                ordered: true,
                mode: 'exactly',
                numCards: remainingCards.length,
                activePromptTitle: 'Select order to place cards on bottom (bottom card last)',
                cardCondition: card => remainingCards.includes(card),
                onSelect: (player, selectedCards) => {
                    context.orderedBottomCards = selectedCards;
                    return true;
                },
                onCancel: () => {
                    context.orderedBottomCards = remainingCards;
                    return true;
                }
            });
        } else {
            context.orderedBottomCards = [];
        }
    }
}

Queenscrown.code = '07019';

module.exports = Queenscrown;
