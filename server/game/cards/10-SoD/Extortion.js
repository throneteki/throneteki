const DrawCard = require('../../drawcard.js');

class Extortion extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.attackingPlayer === this.controller && event.challenge.winner === this.controller &&
                                         event.challenge.challengeType === 'intrigue'
            },
            handler: context => {
                this.game.addGold(context.player, 3);

                let loser = context.event.challenge.loser;
                let returnGold = Math.min(loser.gold, 3);
                this.game.returnGoldToTreasury({ player: loser, amount: returnGold });

                this.game.addMessage('{0} plays {1} to gain 3 gold and return {2} gold from {3}\'s gold pool to the treasury',
                    context.player, this, returnGold, loser);
            }
        });
    }
}

Extortion.code = '10030';

module.exports = Extortion;
