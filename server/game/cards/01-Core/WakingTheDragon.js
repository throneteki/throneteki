const DrawCard = require('../../drawcard.js');

class WakingTheDragon extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Stand a character',
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isFaction('targaryen') &&
                    card.isUnique() &&
                    card.controller === this.controller
            },
            handler: (context) => {
                let targetCharacter = context.target;
                context.player.standCard(targetCharacter);

                this.atEndOfPhase((ability) => ({
                    match: targetCharacter,
                    condition: () => ['play area', 'duplicate'].includes(targetCharacter.location),
                    effect: ability.effects.returnToHandIfStillInPlay(true)
                }));

                this.game.addMessage(
                    '{0} plays {1} to stand {2}',
                    this.controller,
                    this,
                    targetCharacter
                );
            }
        });
    }
}

WakingTheDragon.code = '01178';

module.exports = WakingTheDragon;
