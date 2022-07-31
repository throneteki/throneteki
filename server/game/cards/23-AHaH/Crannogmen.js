const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');
const {Tokens} = require('../../Constants');

class Crannogmen extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card.hasTrait('House Reed')
            },
            target: {
                type: 'select',
                cardCondition: card => card.location === 'play area' && card.controller !== this.controller &&
                                       card.getType() === 'character'
            },
            message: '{player} uses {source} to place a Poison token on {target}',
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.placeToken({
                        card: context.target, token: Tokens.poison
                    }).then({
                        condition: () => context.target.getStrength() <= context.target.tokens[Tokens.poison],
                        cost: ability.costs.putSelfIntoShadows(),
                        message: {
                            format: 'Then, {player} returns {source} to shadows to kill {poisonedCharacter}',
                            args: { poisonedCharacter: () => context.target }
                        },
                        handler: () => {
                            this.game.killCharacter(context.target);
                        }
                    }),
                    context
                );
            }
        });
    }
}

Crannogmen.code = '23011';

module.exports = Crannogmen;
