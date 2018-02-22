const DrawCard = require('../../drawcard.js');

class TheBlackfish extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.getPower() >= 4,
            match: (card) => card.hasTrait('House Tully') && card.getType() === 'character',
            effect: ability.effects.doesNotKneelAsAttacker()
        });

        this.reaction({
            when: {
                afterChallenge: event =>
                    event.challenge.winner === this.controller &&
                    event.challenge.challengeType === 'military' &&
                    event.challenge.isAttackerTheWinner()
            },
            handler: () => {
                this.controller.drawCardsToHand(1);
                this.game.addMessage('{0} uses {1} to draw a card', this.controller, this);
            }
        });
    }
}

TheBlackfish.code = '03004';

module.exports = TheBlackfish;
