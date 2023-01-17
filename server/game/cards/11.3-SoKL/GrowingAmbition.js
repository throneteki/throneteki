const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions/index.js');
const TextHelper = require('../../TextHelper');

class GrowingAmbition extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search deck',
            phase: 'challenge',
            cost: ability.costs.payXGold(() => 1, () => this.controller.drawDeck.length),
            message: {
                format: '{player} plays {source} to search their deck for {amount} cards',
                args: { amount: context => context.xValue }
            },
            gameAction: GameActions.search({
                title: context => `Select ${TextHelper.count(context.xValue, 'card')}`,
                numToSelect: context => context.xValue,
                match: { condition: (card, context) => !context.selectedCards.some(selected => selected.name === card.name) },
                reveal: false,
                message: '{player} places {searchTarget} in their discard pile',
                gameAction: GameActions.simultaneously(context => 
                    context.searchTarget.map(card => GameActions.placeCard({ player: context.player, card: card, location: 'discard pile' }))
                )
            }).then({
                title: 'Select cards',
                chooseOpponent: true,
                handler: context => {
                    this.game.promptForSelect(context.opponent, {
                        mode: 'exactly',
                        activePromptTitle: `Select ${TextHelper.count(context.parentContext.xValue, 'card')}`,
                        cardCondition: { controller: context.player, location: 'discard pile' },
                        numCards: context.parentContext.xValue,
                        source: this,
                        onSelect: (player, cards) => {
                            this.game.addMessage('Then, {0} returns {1} to {2}\'s hand', player, cards, context.player);
                            this.game.resolveGameAction(
                                GameActions.simultaneously(() => 
                                    cards.map(card => GameActions.placeCard({ player: context.player, card: card, location: 'hand' }))
                                ), 
                                context
                            );
                            return true;
                        },
                        onCancel: (player) => {
                            this.game.addAlert('danger', '{0} cancels the resolution of {1}', player, context.source);
                            return true;
                        }
                    });
                }
            })
        });
    }
}

GrowingAmbition.code = '11044';

module.exports = GrowingAmbition;
