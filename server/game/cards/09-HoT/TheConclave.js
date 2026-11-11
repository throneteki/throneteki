import GameActions from '../../GameActions/index.js';
import AgendaCard from '../../agendacard.js';

class TheConclave extends AgendaCard {
    // The Conclave (09045)
    // Your deck may include non-loyal Maester characters from any faction. Your deck must include
    // at least 12 Maester characters. Before placing setup cards, place the top 7 cards of your
    // deck facedown under this agenda.
    // Reaction: After you win a challenge in which you control a participating Maester character,
    // choose 1 card under this agenda and switch it with the top card of your deck.
    setupCardAbilities() {
        this.eventCheck({
            when: {
                onPlayerKeepHandOrMulligan: (event, context) => event.player === context.player
            },
            message: '{player} places the top 7 cards of their deck facedown under {source}',
            gameAction: GameActions.simultaneously((context) =>
                context.player.drawDeck.slice(0, 7).map((card) =>
                    GameActions.placeCardUnderneath({
                        card,
                        parentCard: context.source,
                        facedown: true
                    })
                )
            )
        });
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    context.player.anyCardsInPlay(
                        (card) =>
                            card.getType() === 'character' &&
                            card.hasTrait('Maester') &&
                            card.isParticipating()
                    )
            },
            condition: (context) => context.player.drawDeck.length > 0,
            target: {
                activePromptTitle: 'Choose Conclave card to swap with top of deck',
                cardCondition: (card, context) => context.player.agenda.underneath.includes(card)
            },
            message:
                '{player} uses {source} to swap the top card of their deck with a facedown card under their agenda',
            gameAction: GameActions.simultaneously((context) => [
                GameActions.placeCard({
                    card: context.target,
                    player: context.player,
                    location: 'draw deck'
                }),
                GameActions.placeCardUnderneath({
                    card: context.player.drawDeck[0],
                    parentCard: context.source,
                    facedown: true
                })
            ])
        });
    }
}

TheConclave.code = '09045';

export default TheConclave;
