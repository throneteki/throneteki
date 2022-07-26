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
            gameAction: GameActions.placeToken({
                card: this,
                token: Tokens.journey
            })
        });

        this.action({
            title: 'Search the deck',
            cost: ability.costs.sacrificeSelf(),
            message: {
                format: '{player} sacrifices {costs.sacrifice} to search their deck for a character with printed cost {tokens} or lower',
                args: { tokens: context => this.numberOfJourneyTokens(context) }
            },
            gameAction: GameActions.search({
                title: 'Select a character',
                match: { type: 'character', condition: (card, context) => card.getPrintedCost() <= this.numberOfJourneyTokens(context) },
                reveal: false,
                message: '{player} {gameAction}',
                gameAction: GameActions.putIntoPlay(context => ({
                    card: context.searchTarget
                }))
            })
        });
    }

    numberOfJourneyTokens(context) {
        return context.cardStateWhenInitiated.tokens[Tokens.journey] || 0;
    }
}

Meadowlark.code = '13076';

module.exports = Meadowlark;
