const DrawCard = require('../../../drawcard.js');

class CerseiLannister extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onAttackersDeclared']);
    }

    onAttackersDeclared(e, challenge) {
        var player = challenge.attackingPlayer;
        if(!this.inPlay || this.owner !== player || challenge.challengeType !== 'intrigue') {
            return;
        }

        if(!this.isBlank() && player.cardsInChallenge.any(card => {
            return card.uuid === this.uuid;
        })) {
            this.kneeled = false;
        }
    }
}

CerseiLannister.code = '05001';

module.exports = CerseiLannister;
