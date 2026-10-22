import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

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
                onPhaseStarted: (event, context) =>
                    event.phase === 'dominance' &&
                    context.source.hasHigherReserveThanOpponent() &&
                    context.source.controller.canDraw()
            },
            message: '{player} uses {source} to draw 1 card',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
        });
    }

    hasHigherReserveThanOpponent() {
        let opponents = this.game.getOpponents(this.controller);
        return opponents.some((opponent) => this.controller.getReserve() > opponent.getReserve());
    }
}

EastwatchByTheSea.code = '06006';

export default EastwatchByTheSea;
