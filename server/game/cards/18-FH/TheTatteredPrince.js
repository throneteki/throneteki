const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');
const {Tokens} = require('../../Constants');

class TheTatteredPrince extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onCardPlaced: event => event.location === 'revealed plots' && event.player === this.controller
            },
            gameAction: GameActions.ifCondition({
                condition: context => context.source.hasToken(Tokens.gold),
                thenAction: GameActions.choose({
                    title: context => `Discard 1 gold for ${context.source.name}?`,
                    choices: {
                        'Yes': {
                            message: '{player} chooses to discard a gold from {source}',
                            gameAction: GameActions.discardToken(context => ({ card: context.source, token: Tokens.gold }))
                        },
                        'No': {
                            message: '{player} chooses to return {source} to shadows',
                            gameAction: GameActions.putIntoShadows(context => ({ card: context.source }))
                        }
                    }
                }),
                elseAction: {
                    message: '{player} is forced to return {source} to shadows',
                    gameAction: GameActions.putIntoShadows(context => ({ card: context.source }))
                }
            })
        });
    }
}

TheTatteredPrince.code = '18008';

module.exports = TheTatteredPrince;
