const DrawCard = require('../../drawcard.js');

class HearMeRoar extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Put character into play',
            target: {
                cardCondition: (card) =>
                    card.location === 'hand' &&
                    card.controller === this.controller &&
                    card.getType() === 'character' &&
                    card.isFaction('lannister') &&
                    this.controller.canPutIntoPlay(card)
            },
            handler: (context) => {
                context.player.putIntoPlay(context.target);

                this.atEndOfPhase((ability) => ({
                    match: context.target,
                    condition: () => ['play area', 'duplicate'].includes(context.target.location),
                    targetLocation: 'any',
                    effect: ability.effects.discardIfStillInPlay(false)
                }));

                this.game.addMessage(
                    '{0} plays {1} to put {2} into play from their hand',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

HearMeRoar.code = '01100';

module.exports = HearMeRoar;
