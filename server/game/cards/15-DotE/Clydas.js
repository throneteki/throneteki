const DrawCard = require('../../drawcard.js');

class Clydas extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move 1 gold to your gold pool',
            limit: ability.limit.perPhase(1),
            chooseOpponent: true,
            handler: context => {
                let opponent = context.opponent;

                if(!opponent) {
                    return;
                }

                this.game.transferGold({ from: opponent, to: this.controller, amount: 1 });
                this.game.addMessage('{0} uses {1} to move 1 gold from {2}\'s gold pool to their own',
                    this.controller, this, opponent);
            }
        });
    }
}

Clydas.code = '15033';

module.exports = Clydas;
