const DrawCard = require('../../drawcard');

class ShadowPriestess extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.attachments.length === 0,
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

ShadowPriestess.code = '11008';

module.exports = ShadowPriestess;
