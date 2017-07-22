const DrawCard = require('../../../drawcard.js');

class AMeagerContribution extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            max: ability.limit.perRound(1),
            when: {
                onIncomeCollected: event => event.player !== this.controller
            },
            handler: context => {
                let opponent = context.event.player;
                this.game.addGold(opponent, -1);
                this.game.addGold(this.controller, 1);

                this.game.addMessage('{0} uses {1} to move 1 gold from {2}\'s gold pool to their own',
                    this.controller, this, opponent);
            }
        });
    }
}

AMeagerContribution.code = '01138';

module.exports = AMeagerContribution;
