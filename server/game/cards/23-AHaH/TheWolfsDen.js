const DrawCard = require('../../drawcard.js');
const {Tokens} = require('../../Constants');
const GameActions = require('../../GameActions/index.js');

class TheWolfsDen extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                'onSacrificed': event => event.card.getType() === 'character' && event.card.controller === this.controller,
                'onCharacterKilled': event => event.card.controller === this.controller
            },
            cost: ability.costs.kneelSelf(),
            message: '{player} kneels {source} to put the bottom card of their deck into shadows',
            gameAction: GameActions.placeCard(context => ({ card: context.player.drawDeck.slice(-1)[0], location: 'shadows' }))
                .then({
                    gameAction: GameActions.simultaneously([
                        GameActions.placeToken(context => ({ card: context.event.card, tokens: Tokens.shadow })),
                        GameActions.genericHandler(context => {
                            this.lastingEffect(ability => ({
                                condition: () => context.event.card.location === 'shadows',
                                targetLocation: 'any',
                                match: context.event.card,
                                effect: ability.effects.addKeyword(`Shadow (${context.event.card.getPrintedCost()})`)
                            }));
                        })
                    ])
                })
        });
    }
}

TheWolfsDen.code = '23012';

module.exports = TheWolfsDen;
