const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class EllariaSand extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => this.controller === challenge.loser && challenge.isParticipating(this)
            },
            cost: ability.costs.discardGold(),
            handler: () => {
                let bastards = this.controller.filterCardsInPlay(card => card.hasTrait('Bastard') && card.getType() === 'character');

                _.each(bastards, card => {
                    card.controller.standCard(card);
                });

                this.game.addMessage('{0} discards 1 gold from {1} to stand {2}', this.controller, this, bastards);
            }
        });
    }
}

EllariaSand.code = '06075';

module.exports = EllariaSand;
