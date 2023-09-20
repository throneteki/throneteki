const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class ALannistersHonor extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.isMatch({ winner: this.controller, attackingPlayer: this.controller, challengeType: 'intrigue' })
            },
            target: {
                choosingPlayer: (player, context) => player === context.event.challenge.loser,
                cardCondition: { type: 'character', location: 'play area', controller: 'choosingPlayer', condition: (card, context) => card.getStrength() === this.getLowestStrInPlay(context.event.challenge.loser) && GameActions.kill({ card }).allow() }
            },
            max: ability.limit.perChallenge(1),
            message: {
                format: '{player} plays {source} to have {loser} choose and kill a character they control with the lowest STR',
                args: { loser: context => context.event.challenge.loser }
            },
            handler: context => {
                context.game.resolveGameAction(GameActions.kill(context => ({ card: context.target })), context);
            }
        });
    }

    getLowestStrInPlay(player) {
        let characters = player.filterCardsInPlay({ type: 'character' });
        let strengths = characters.map(card => card.getStrength());
        return Math.min(...strengths);
    }
}

ALannistersHonor.code = '25535';
ALannistersHonor.version = '1.2';

module.exports = ALannistersHonor;
