const DrawCard = require('../../drawcard.js');

class BurningBright extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Put character into play',
            target: {
                type: 'select',
                cardCondition: (card, context) =>
                    card.getType() === 'character' &&
                    (card.hasTrait('Knight') || card.hasTrait('Army')) &&
                    card.controller === context.player &&
                    'discard pile' === card.location &&
                    context.player.canPutIntoPlay(card)
            },
            message: {
                format: '{player} uses {source} to put {target} into play from their {originalLocation}',
                args: { originalLocation: (context) => context.target.location }
            },
            handler: (context) => {
                context.player.putIntoPlay(context.target);
                this.atEndOfPhase((ability) => ({
                    match: context.target,
                    condition: () => ['play area', 'duplicate'].includes(context.target.location),
                    targetLocation: 'any',
                    effect: ability.effects.discardIfStillInPlay(false)
                }));
            }
        });
    }
}
BurningBright.code = '20015';

module.exports = BurningBright;
