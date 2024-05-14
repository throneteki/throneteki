const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');
const { Tokens } = require('../../Constants');

class TheBoneway extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) => event.challenge.loser === this.controller
            },
            message: '{player} uses {source} to place 1 vengeance token on {source}',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.placeToken(() => ({ card: this, token: Tokens.vengeance })),
                    context
                );
            }
        });

        this.action({
            title: 'Gain 3 power for your faction',
            phase: 'dominance',
            condition: () => this.controller.canGainFactionPower(),
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.discardTokenFromSelf(Tokens.vengeance, 6)
            ],
            handler: () => {
                this.game.addPower(this.controller, 3);
                this.game.addMessage(
                    '{0} kneels and discards 6 vengeance tokens from {1} to gain 3 power for their faction',
                    this.controller,
                    this
                );
            }
        });
    }
}

TheBoneway.code = '02056';

module.exports = TheBoneway;
