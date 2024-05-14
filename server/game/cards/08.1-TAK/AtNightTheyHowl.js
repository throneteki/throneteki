const DrawCard = require('../../drawcard.js');

class AtNightTheyHowl extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Stand Direwolves',
            phase: 'challenge',
            target: {
                mode: 'unlimited',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.kneeled &&
                    (card.hasTrait('Direwolf') ||
                        card.attachments.some((attachment) => attachment.hasTrait('Direwolf')))
            },
            handler: (context) => {
                for (let card of context.target) {
                    card.controller.standCard(card);
                }

                this.game.addMessage(
                    '{0} plays {1} to stand {2}',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

AtNightTheyHowl.code = '08003';

module.exports = AtNightTheyHowl;
