const _ = require('underscore');

const AgendaCard = require('../../agendacard.js');

class TheConclave extends AgendaCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.owner.createAdditionalPile('conclave', { isPrivate: true });
        this.registerEvents(['onPlayerKeepHandOrMulligan']);
    }

    setupCardAbilities() {
        this.reaction({
            when : {
                afterChallenge: (event, challenge) => challenge.winner === this.controller && this.hasParticipatingMaester(challenge)
            },
            target: {
                activePromptTitle: 'Choose Conclave card to swap with top of deck',
                cardCondition: card => card.location === 'conclave'
            },
            handler: context => {
                let topCard = this.controller.drawDeck.first();
                this.controller.moveCard(context.target, 'draw deck');
                this.controller.moveCard(topCard, 'conclave');
                this.game.addMessage('{0} uses {1} to swap the top card of their deck with one under their agenda', this.controller, this);
            }
        });
    }

    hasParticipatingMaester(challenge) {
        return this.controller.anyCardsInPlay(card => (
            card.hasTrait('Maester') &&
            card.getType() === 'character' &&
            challenge.isParticipating(card)
        ));
    }

    onPlayerKeepHandOrMulligan(event) {
        if(event.player !== this.controller) {
            return;
        }

        let top7Cards = this.controller.drawDeck.first(7);
        _.each(top7Cards, card => {
            this.controller.moveCard(card, 'conclave');
        });
        this.game.addMessage('{0} moves the top 7 cards of their deck under {1}', this.controller, this);
    }
}

TheConclave.code = '09045';

module.exports = TheConclave;
