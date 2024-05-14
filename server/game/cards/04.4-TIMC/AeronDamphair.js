import DrawCard from '../../drawcard.js';

class AeronDamphair extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardSaved: (event) => event.card.getType() === 'character'
            },
            handler: (context) => {
                let card = context.event.card;
                if (card.kneeled) {
                    card.controller.standCard(card);
                    this.game.addMessage('{0} uses {1} to stand {2}', this.controller, this, card);
                } else {
                    card.controller.kneelCard(card);
                    this.game.addMessage('{0} uses {1} to kneel {2}', this.controller, this, card);
                }
            }
        });
    }
}

AeronDamphair.code = '04071';

export default AeronDamphair;
