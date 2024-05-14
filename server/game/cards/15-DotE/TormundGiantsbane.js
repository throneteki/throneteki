const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');
const { Tokens } = require('../../Constants');

class TormundGiantsbane extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && this.isParticipating()
            },
            message: '{player} places 1 tale token on {source}',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.placeToken(() => ({ card: this, token: Tokens.tale })),
                    context
                );
            }
        });

        this.action({
            title: 'Give Wildling +2 STR',
            cost: ability.costs.discardTokenFromSelf(Tokens.tale, 1),
            target: {
                type: 'select',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.hasTrait('Wildling') &&
                    card.getType() === 'character'
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} and discards 1 tale token to increase the strength of {2} by 2 and give renown until the end of the phase',
                    this.controller,
                    this,
                    context.target
                );
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: [
                        ability.effects.modifyStrength(2),
                        ability.effects.addKeyword('Renown')
                    ]
                }));
            }
        });
    }
}

TormundGiantsbane.code = '15040';

module.exports = TormundGiantsbane;
