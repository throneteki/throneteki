import AgendaCard from '../../agendacard.js';
import GameActions from '../../GameActions/index.js';

class Greensight extends AgendaCard {
    // Greensight (08079)
    // Forced Reaction: After the draw phase begins, reveal the top card of each player's deck. You
    // may kneel your faction card to discard those cards.
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'draw'
            },
            message: "{player} is forced by {source} to reveal the top cards of each player's deck",
            gameAction: GameActions.revealCards((context) => ({
                cards: context.game.getPlayers().map((player) => player.drawDeck[0]),
                whileRevealed: GameActions.may({
                    title: 'Kneel faction card to discard cards?',
                    gameAction: GameActions.kneelCard((context) => ({
                        card: context.player.faction
                    })).then({
                        message: {
                            format: '{player} kneels their faction card to discard {revealed}',
                            args: { revealed: (context) => context.parentContext.revealed }
                        },
                        gameAction: GameActions.simultaneously((context) =>
                            context.parentContext.revealed.map((card) =>
                                GameActions.discardCard({ card, source: context.source })
                            )
                        )
                    })
                })
            }))
        });
    }
}

Greensight.code = '08079';

export default Greensight;
