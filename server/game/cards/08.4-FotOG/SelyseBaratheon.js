import DrawCard from '../../drawcard.js';

class SelyseBaratheon extends DrawCard {
    // Selyse Baratheon (08067)
    // Forced Reaction: After you marshal Selyse Baratheon, kneel your faction card. Then, kneel
    // each non-Lady character.
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

export default SelyseBaratheon;
