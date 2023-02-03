const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class WarScorpion extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyStrength(2)
        });
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller
                                            && event.challenge.challengeType === 'military'
                                            && event.challenge.isDefending(this.parent)
            },
            cost: ability.costs.sacrificeSelf(),
            target: {
                type: 'select',
                cardCondition: { attacking: true, trait: ['Army', 'Dragon'] }
            },
            message: '{player} sacrifices {costs.sacrifice} to kill {target}',
            handler: context => {
                this.game.resolveGameAction(GameActions.kill(context => ({ card: context.target, player: context.player })), context);
            }
        });
    }
}

WarScorpion.code = '24012';

module.exports = WarScorpion;
