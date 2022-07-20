const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class INeverBetAgainstMyFamily extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put character in play from bottom of your deck',
            phase: 'challenge',
            cost: ability.costs.kneelFactionCard(),
            message: '{player} plays {source} and kneels their faction card to reveal the bottom 5 cards of their deck',
            gameAction: GameActions.revealCards(context => ({
                cards: context.player.searchDrawDeck(-5),
                player: context.player,
                whileRevealed: GameActions.genericHandler(context => {
                    this.choosePutIntoPlay(context);
                })
            })).then(context => ({
                handler: () => {
                    if(context.target) {
                        this.game.addMessage('{0} puts {1} into play', context.player, context.target);
                        this.game.resolveGameAction(
                            GameActions.putIntoPlay(context => ({
                                card: context.target
                            })).then({
                                handler: context => {
                                    this.atEndOfPhase(ability => ({
                                        match: context.parentContext.target,
                                        condition: () => ['play area', 'duplicate'].includes(context.parentContext.target.location),
                                        targetLocation: 'any',
                                        effect: ability.effects.discardIfStillInPlay(false)
                                    }));
                                }
                            }),
                            context
                        );
                    }

                    this.game.addMessage('{0} places {1} cards on the bottom of their draw deck', context.player, context.orderedBottomCards.length);
                    this.game.resolveGameAction(
                        GameActions.simultaneously(context => context.orderedBottomCards.map(card => (
                            GameActions.placeCard({
                                card,
                                player: card.owner,
                                location: 'draw deck',
                                bottom: true
                            })
                        ))),
                        context
                    );
                }
            }))
        });
    }

    choosePutIntoPlay(context) {
        const isUniqueLannister = card => card.isMatch({ type: 'character', unique: true, faction: 'lannister' });

        if(context.revealed.some(isUniqueLannister)) {
            this.game.promptForSelect(context.player, {
                activePromptTitle: 'Select a character',
                cardCondition: card => context.revealed.includes(card) && isUniqueLannister(card),
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

INeverBetAgainstMyFamily.code = '02050';

module.exports = INeverBetAgainstMyFamily;
