const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class Hero extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event =>
                    event.challenge.winner === this.controller
                    && this.isParticipating()
                    && this.controller.hand.length < event.challenge.loser.hand.length
            },
            target: {
                type: 'select',
                cardCondition: { or: [{type: 'character', trait: 'Army'}, { name: 'Grey Worm' }] }
            },
            limit: ability.limit.perPhase(2),
            message: '{player} uses {source} to stand {target}',
            handler: context => {
                this.game.resolveGameAction(GameActions.standCard(context => ({ card: context.target })), context);
            }
        });
    }
}

Hero.code = '24019';

module.exports = Hero;
