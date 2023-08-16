const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class ABedOfScorpions extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.isMatch({ winner: this.controller, challengeType: 'intrigue' })
            },
            target: {
                cardCondition: { type: 'character', participating: true, condition: card => !card.hasIcon('intrigue') && GameActions.kill({ card }).allow() }
            },
            message: '{player} plays {source} to kill {target}',
            handler: context => {
                context.game.resolveGameAction(GameActions.kill(context => ({ card: context.target })), context);
            }
        });
    }
}

ABedOfScorpions.code = '25547';
ABedOfScorpions.version = '1.0';

module.exports = ABedOfScorpions;
