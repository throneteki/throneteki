const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');
const {Tokens} = require('../../Constants');

class Mord extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            // TODO: Handle placing a jail token on Mord. Currently it results in a infinite loop that crashes the game.
            condition: () => !this.kneeled && !this.hasToken(Tokens.jail),
            match: card => card.hasToken(Tokens.jail),
            effect: ability.effects.blankExcludingTraits
        });

        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this
            },
            target: {
                type: 'select',
                cardCondition: { type: 'character', location: 'play area' }
            },
            message: '{player} uses {source} to place a jail token on {target}',
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.placeToken({
                        card: context.target,
                        token: Tokens.jail,
                        amount: 1
                    }),
                    context
                );
            }
        });
    }
}

Mord.code = '23023';

module.exports = Mord;
