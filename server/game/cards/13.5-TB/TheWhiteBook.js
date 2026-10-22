import AgendaCard from '../../agendacard.js';
import GameActions from '../../GameActions/index.js';

class TheWhiteBook extends AgendaCard {
    // The White Book (13099)
    // You may include non-loyal Kingsguard characters from any faction in your deck. You must
    // include at least 7 different Kingsguard characters in your deck.
    // Reaction: After you win a challenge, kneel your faction card to stand each defending
    // Kingsguard character you control. (Each participating Kingsguard character you control
    // instead if you control a King or Queen character.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    eligibleKingsguard(context.player).length > 0
            },
            cost: ability.costs.kneelFactionCard(),
            message: {
                format: '{player} uses {source} and kneels their faction card to stand {kingsguard}',
                args: { kingsguard: (context) => eligibleKingsguard(context.player) }
            },
            gameAction: GameActions.simultaneously((context) =>
                eligibleKingsguard(context.player).map((card) => GameActions.standCard({ card }))
            )
        });
    }
}

function eligibleKingsguard(player) {
    if (player.anyCardsInPlay({ type: 'character', trait: ['King', 'Queen'] })) {
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

TheWhiteBook.code = '13099';

export default TheWhiteBook;
