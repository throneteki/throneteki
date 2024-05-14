const DrawCard = require('../../drawcard.js');

class Harrenhal extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put character into play',
            cost: ability.costs.kneelSelf(),
            phase: 'challenge',
            target: {
                cardCondition: (card) =>
                    card.location === 'hand' &&
                    card.controller === this.controller &&
                    card.getType() === 'character' &&
                    (card.isFaction('lannister') || card.hasTrait('House Bolton')) &&
                    this.controller.canPutIntoPlay(card)
            },
            handler: (context) => {
                this.controller.putIntoPlay(context.target);

                this.atEndOfPhase((ability) => ({
                    match: context.target,
                    condition: () => 'play area' === context.target.location,
                    effect: ability.effects.killIfStillInPlay(false)
                }));

                this.game.addMessage(
                    '{0} kneels {1} to put {2} into play from their hand',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

Harrenhal.code = '04050';

module.exports = Harrenhal;
