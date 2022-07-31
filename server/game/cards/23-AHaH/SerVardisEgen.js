const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class SerVardisEgen extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {                
                afterChallenge: event => this.isDefending() && event.challenge.isMatch({ loser: this.controller })
            },
            cost: ability.costs.sacrificeSelf(),
            target: {
                type: 'select',
                cardCondition: { type: 'character', attacking: true, not: { trait: 'Army' } }
            },
            message: {
                format: '{player} sacrifices {source} to return {target} to {owner}\'s hand',
                args: { owner: context => context.target.owner }
            },
            handler: context => {
                this.game.resolveGameAction(GameActions.returnCardToHand(context => ({ card: context.target })), context);
            }
        });
    }
}

SerVardisEgen.code = '23026';

module.exports = SerVardisEgen;
