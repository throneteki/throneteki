const DrawCard = require('../../drawcard.js');

class EastwatchByTheSea extends DrawCard {
    setupCardAbilities() {
        this.plotModifiers({
            reserve: 1
        });

        this.reaction({
            when: {
                onPhaseStarted: event => event.phase === 'dominance' && this.hasHigherReserveThanOpponent()
            },
            handler: () => {
                this.controller.drawCardsToHand(1);
                this.game.addMessage('{0} uses {1} to draw 1 card', this.controller, this);
            }
        });
    }

    hasHigherReserveThanOpponent() {
        let opponent = this.game.getOtherPlayer(this.controller);
        return opponent && this.controller.getTotalReserve() > opponent.getTotalReserve();
    }
}

EastwatchByTheSea.code = '06006';

module.exports = EastwatchByTheSea;
