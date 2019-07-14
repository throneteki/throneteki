const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');
const {Tokens} = require('../../Constants');

class Meadowlark extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPlotRevealed: event => event.plot.controller === this.controller
            },
            message: '{player} uses {source} to place 1 journey token on {source}',
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.placeToken({
                        card: this,
                        token: Tokens.journey
                    }),
                    context
                );
            }
        });

        this.action({
            title: 'Search the deck',
            cost: ability.costs.sacrificeSelf(),
            message: '{player} sacrifices {source} to search their deck',
            handler: context => {
                const journeyTokens = context.cardStateWhenInitiated.tokens[Tokens.journey] || 0;
                this.game.promptForDeckSearch(context.player, {
                    activePromptTitle: 'Select a character',
                    cardCondition: card => card.getType() === 'character' && card.getPrintedCost() <= journeyTokens && context.player.canPutIntoPlay(card),
                    onSelect: (player, card) => this.cardSelected(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card) {
        this.game.addMessage('{0} puts {1} into play for {2}', player, card, this);
        player.putIntoPlay(card);
    }

    doneSelecting(player) {
        this.game.addMessage('{0} does not put a character into play for {1}', player, this);
    }
}

Meadowlark.code = '13076';

module.exports = Meadowlark;
