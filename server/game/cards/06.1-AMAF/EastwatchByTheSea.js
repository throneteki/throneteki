import DrawCard from '../../drawcard.js';

class EastwatchByTheSea extends DrawCard {
    setupCardAbilities() {
        this.plotModifiers({
            reserve: 1
        });

        this.reaction({
            when: {
                onPhaseStarted: (event) =>
                    event.phase === 'dominance' &&
                    this.hasHigherReserveThanOpponent() &&
                    this.controller.canDraw()
            },
            handler: () => {
                this.controller.drawCardsToHand(1);
                this.game.addMessage('{0} uses {1} to draw 1 card', this.controller, this);
            }
        });
    }

    hasHigherReserveThanOpponent() {
        let opponents = this.game.getOpponents(this.controller);
        return opponents.some((opponent) => this.controller.getReserve() > opponent.getReserve());
    }
}

EastwatchByTheSea.code = '06006';

export default EastwatchByTheSea;
