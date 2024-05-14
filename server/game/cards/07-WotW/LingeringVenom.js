const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');
const { Tokens } = require('../../Constants');

class LingeringVenom extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) => event.challenge.loser === this.controller
            },
            message: '{player} uses {source} to place 1 venom token on {source}',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.placeToken({
                        card: this,
                        token: Tokens.venom
                    }).then({
                        condition: () => this.parent.getStrength() <= this.tokens[Tokens.venom],
                        message: {
                            format: 'Then {player} uses {source} to kill {parent}',
                            args: { parent: () => this.parent }
                        },
                        handler: () => {
                            this.game.killCharacter(this.parent);
                        }
                    }),
                    context
                );
            }
        });
    }
}

LingeringVenom.code = '07032';

module.exports = LingeringVenom;
