import AgendaCard from '../../agendacard.js';
import GameActions from '../../GameActions/index.js';

class TheWhiteBook extends AgendaCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    this.eligibleKingsguard(this.controller).length > 0
            },
            cost: ability.costs.kneelFactionCard(),
            message: {
                format: '{player} uses {source} and kneels their faction card to stand {kingsguard}',
                args: { kingsguard: (context) => this.eligibleKingsguard(context.player) }
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.simultaneously(
                        this.eligibleKingsguard(context.player).map((card) =>
                            GameActions.standCard({ card })
                        )
                    ),
                    context
                );
            }
        });
    }

    controlsKingOrQueen(player) {
        return player.anyCardsInPlay({ type: 'character', trait: ['King', 'Queen'] });
    }

    eligibleKingsguard(player) {
        if (this.controlsKingOrQueen(player)) {
            return player.filterCardsInPlay({
                type: 'character',
                trait: 'Kingsguard',
                participating: true
            });
        }

        return player.filterCardsInPlay({
            type: 'character',
            trait: 'Kingsguard',
            defending: true
        });
    }
}

TheWhiteBook.code = '13099';

export default TheWhiteBook;
