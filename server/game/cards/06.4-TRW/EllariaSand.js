const DrawCard = require('../../drawcard.js');

class EllariaSand extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    this.controller === event.challenge.loser && this.isParticipating()
            },
            cost: ability.costs.discardGold(),
            handler: () => {
                let bastards = this.controller.filterCardsInPlay(
                    (card) => card.hasTrait('Bastard') && card.getType() === 'character'
                );

                for (let card of bastards) {
                    card.controller.standCard(card);
                }

                this.game.addMessage(
                    '{0} discards 1 gold from {1} to stand {2}',
                    this.controller,
                    this,
                    bastards
                );
            }
        });
    }
}

EllariaSand.code = '06075';

module.exports = EllariaSand;
