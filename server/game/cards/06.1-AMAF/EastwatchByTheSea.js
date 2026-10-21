import DrawCard from '../../drawcard.js';

class EastwatchByTheSea extends DrawCard {
    // Eastwatch-by-the-Sea (06006)
    // Reaction: After the dominance phase begins, if you have a higher reserve value than an
    // opponent, draw 1 card.
    // +1 Reserve.
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
