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
                cardCondition: (card) => card.location === 'conclave'
            },
            handler: (context) => {
                let topCard = this.controller.drawDeck[0];
                this.controller.moveCard(context.target, 'draw deck');
                this.controller.moveCard(topCard, 'conclave');
                this.game.addMessage(
                    '{0} uses {1} to swap the top card of their deck with one under their agenda',
                    this.controller,
                    this
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

        let top7Cards = this.controller.drawDeck.slice(0, 7);
        for (let card of top7Cards) {
            this.controller.moveCard(card, 'conclave');
        }
        this.game.addMessage(
            '{0} moves the top 7 cards of their deck under {1}',
            this.controller,
            this
        );
    }
}

TheConclave.code = '09045';

export default TheConclave;
