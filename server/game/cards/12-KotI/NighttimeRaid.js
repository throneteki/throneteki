const DrawCard = require('../../drawcard');

class RedRain extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Give stealth',
            target: {
                mode: 'upTo',
                numCards: 3,
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    (card.hasKeyword('Pillage') || card.hasTrait('Raider'))
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} plays {1} to have {2} gain stealth until the end of the phase',
                    context.player,
                    this,
                    context.target
                );
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.addKeyword('Stealth')
                }));
            }
        });
    }
}

RedRain.code = '12024';

module.exports = RedRain;
