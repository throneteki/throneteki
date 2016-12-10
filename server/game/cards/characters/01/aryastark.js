const DrawCard = require('../../../drawcard.js');

class AryaStark extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onCardEntersPlay', 'onDupeDiscarded']);
    }

    onCardEntersPlay(e, card) {
        if(card !== this) {
            return;
        }

        var dupe = this.controller.drawDeck.first();
        dupe.facedown = true;
        this.controller.removeCardFromPile(dupe);

        this.addDuplicate(dupe);

        this.game.addMessage('{0} places the top card of their deck on {1} as a duplicate', this.controller, this);
    }

    onDupeDiscarded(e, player, card) {
        if(this.controller !== player || card !== this) {
            return;
        }

        if(this.dupes.isEmpty()) {
            this.clearIcon('military');
        }
    }

    addDuplicate(card) {
        super.addDuplicate(card);

        if(this.dupes.size() === 1) {
            this.setIcon('military');
        }
    }
}

AryaStark.code = '01141';

module.exports = AryaStark;
