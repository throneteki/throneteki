const DrawCard = require('../../drawcard.js');

class SerRichardHorpe extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength(() => this.power)
        });

        this.action({
            title: 'Move 1 power',
            limit: ability.limit.perRound(1),
            targets: {
                from: {
                    activePromptTitle: 'Select card with power',
                    cardCondition: (card, context) =>
                        ['active plot', 'faction', 'play area'].includes(card.location) &&
                        card.power > 0 &&
                        card.controller === context.player,
                    cardType: ['attachment', 'character', 'faction', 'location', 'plot']
                },
                to: {
                    activePromptTitle: 'Select card to move power',
                    cardCondition: (card, context) =>
                        ['active plot', 'faction', 'play area'].includes(card.location) &&
                        (!context.targets.from || card !== context.targets.from),
                    cardType: ['attachment', 'character', 'faction', 'location', 'plot']
                }
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to move 1 power from {2} to {3}',
                    context.player,
                    this,
                    context.targets.from,
                    context.targets.to
                );

                this.game.movePower(context.targets.from, context.targets.to, 1);
            }
        });
    }
}

SerRichardHorpe.code = '20001';

module.exports = SerRichardHorpe;
