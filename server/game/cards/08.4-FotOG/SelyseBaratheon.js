const DrawCard = require('../../drawcard.js');

class SelyseBaratheon extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onCardEntersPlay: (event) =>
                    event.card === this &&
                    event.playingType === 'marshal' &&
                    !this.controller.faction.kneeled
            },
            handler: () => {
                this.controller.kneelCard(this.controller.faction);
                this.game.addMessage(
                    '{0} is forced by {1} to kneel their faction card',
                    this.controller,
                    this
                );

                let nonLadies = this.game.filterCardsInPlay(
                    (card) => !card.hasTrait('Lady') && card.getType() === 'character'
                );

                if (nonLadies.length > 0) {
                    for (let card of nonLadies) {
                        card.controller.kneelCard(card);
                    }
                    this.game.addMessage(
                        '{0} then kneels each non-Lady character',
                        this.controller
                    );
                }
            }
        });
    }
}

SelyseBaratheon.code = '08067';

module.exports = SelyseBaratheon;
