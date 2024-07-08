import GameActions from '../../GameActions/index.js';
import AgendaCard from '../../agendacard.js';

class TheConclave extends AgendaCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onPlayerKeepHandOrMulligan']);
    }

    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && this.hasParticipatingMaester()
            },
            target: {
                type: 'select',
                activePromptTitle: 'Choose Conclave card to swap with top of deck',
                cardCondition: (card, context) => context.player.agenda.underneath.includes(card)
            },
            message:
                '{player} uses {source} to swap the top card of their deck with a facedown card under their agenda',
            handler: (context) => {
                context.game.resolveGameAction(
                    GameActions.simultaneously([
                        GameActions.placeCard({
                            card: context.target,
                            player: context.player,
                            location: 'draw deck'
                        }),
                        GameActions.placeCardUnderneath({
                            card: this.controller.drawDeck[0],
                            parentCard: this
                        })
                    ])
                );
            }
        });
    }

    hasParticipatingMaester() {
        return this.controller.anyCardsInPlay(
            (card) =>
                card.hasTrait('Maester') && card.getType() === 'character' && card.isParticipating()
        );
    }

    onPlayerKeepHandOrMulligan(event) {
        if (event.player !== this.controller) {
            return;
        }

        const top7Cards = this.controller.drawDeck.slice(0, 7);
        this.game.resolveGameAction(
            GameActions.simultaneously(
                top7Cards.map((card) =>
                    GameActions.placeCardUnderneath({ card, parentCard: this, facedown: true })
                )
            )
        );
        this.game.addMessage(
            '{0} places the top 7 cards of their deck facedown under {1}',
            this.controller,
            this
        );
    }
}

TheConclave.code = '09045';

export default TheConclave;
