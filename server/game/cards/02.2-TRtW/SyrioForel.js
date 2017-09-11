const DrawCard = require('../../drawcard.js');

class SyrioForel extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give a character military icon and stealth',
            limit: ability.limit.perPhase(1),
            phase: 'challenge',
            target: {
                cardCondition: card => card.getType() === 'character' && card.controller === this.controller
            },
            handler: context => {
                let player = context.player;
                let card = context.target;

                this.game.addMessage('{0} uses {1} to give {2} a {3} icon and stealth until the end of the phase', player, this, card, 'military');
                this.untilEndOfPhase(ability => ({
                    match: card,
                    effect: [
                        ability.effects.addIcon('military'),
                        ability.effects.addKeyword('Stealth')
                    ]
                }));
            }
        });
    }
}

SyrioForel.code = '02037';

module.exports = SyrioForel;
