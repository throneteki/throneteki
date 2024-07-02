import BaseCard from './basecard.js';

class AgendaCard extends BaseCard {
    constructor(owner, cardData) {
        super(owner, cardData);
        this.childCards = [];
    }
    addChildCard(card, location) {
        this.childCards.push(card);
        card.moveTo(location, this);
    }

    removeChildCard(card) {
        if (!card) {
            return;
        }

        this.childCards = this.childCards.filter((a) => a !== card);
    }

    get underneath() {
        return this.childCards.filter((childCard) => childCard.location === 'underneath');
    }

    getSummary(activePlayer) {
        let baseSummary = super.getSummary(activePlayer);

        return Object.assign(baseSummary, {
            childCards: this.childCards.map((card) => {
                return card.getSummary(activePlayer);
            })
        });
    }
}

export default AgendaCard;
