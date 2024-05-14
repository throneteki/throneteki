const DrawCard = require('../../drawcard.js');

class ShireenBaratheon extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCharacterKilled: (event) => event.card === this
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    !card.kneeled,
                gameAction: 'kneel'
            },
            handler: (context) => {
                this.controller.kneelCard(context.target);

                this.game.addMessage(
                    '{0} uses {1} to kneel {2}',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

ShireenBaratheon.code = '01051';

module.exports = ShireenBaratheon;
