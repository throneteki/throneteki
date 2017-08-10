const DrawCard = require('../../../drawcard.js');

class ChamberOfThePaintedTable extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDominanceDetermined: event => this.controller === event.winner && this.opponentHasPower()
            },
            cost: ability.costs.kneelSelf(),
            handler: () => {
                let opponent = this.game.getOtherPlayer(this.controller);
                this.game.addMessage('{0} kneels {1} to move 1 power from {2}\'s faction card to their own',
                    this.controller, this, opponent);
                this.game.transferPower(this.controller, opponent, 1);
            }
        });
    }

    opponentHasPower() {
        let opponent = this.game.getOtherPlayer(this.controller);
        return opponent && opponent.faction.power > 0;
    }
}

ChamberOfThePaintedTable.code = '01060';

module.exports = ChamberOfThePaintedTable;
