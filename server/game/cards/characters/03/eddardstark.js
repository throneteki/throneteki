const DrawCard = require('../../../drawcard.js');
 
class EddardStark extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);
        
        this.registerEvents(['onRenown']);
    }

    onRenown(event, player, card) {
        if(!this.inPlay || this.isBlank() || this.owner !== player || card !== this) {
            return;
        }

        this.game.promptForSelect(player, {
            cardCondition: card => this.cardCondition(card),
            activePromptTitle: 'Select character to gain power',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            onSelect: (player, card) => this.onCardSelected(player, card)
        });
    }

    cardCondition(card) {
        if(card.getType !== 'character') {
            return false;
        }

        if(!this.owner.cardsInChallenge.find(c => {
            return c.uuid === card;
        })) {
            return false;
        }
    }

    onSelect(player, card) {
        if(!this.inPlay || this.isBlank() || this.owner !== player) {
            return;
        }

        card.power++;

        this.game.addMessage('{0} uses {1} to allow {2} to gain 1 power', player, this, card);
    }
}

EddardStark.code = '03003';

module.exports = EddardStark;
