const DrawCard = require('../../../drawcard.js');

class AeronDamphair extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCharacterSaved: () => true
            },
            handler: context => {
                if(context.event.card.kneeled) {
                    context.event.card.controller.standCard(context.event.card);
                    this.game.addMessage('{0} uses {1} to stand {2}', 
                                        this.controller, this, context.event.card);
                } else {
                    context.event.card.controller.kneelCard(context.event.card);
                    this.game.addMessage('{0} uses {1} to kneel {2}', 
                                        this.controller, this, context.event.card);
                }
            }
        });
    }
}

AeronDamphair.code = '04071';

module.exports = AeronDamphair;
