const DrawCard = require('../../drawcard.js');

class ArborQueen extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Increase strength of 2 characters',
            cost: ability.costs.kneelSelf(),
            targets: {
                first: {
                    activePromptTitle: 'Select a Tyrell character',
                    cardCondition: (card) =>
                        card.getType() === 'character' &&
                        card.location === 'play area' &&
                        card.isFaction('tyrell')
                },
                second: {
                    activePromptTitle: 'Select a non-Tyrell character',
                    cardCondition: (card) =>
                        card.getType() === 'character' &&
                        card.location === 'play area' &&
                        !card.isFaction('tyrell')
                }
            },
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.targets.first,
                    effect: ability.effects.modifyStrength(2)
                }));
                this.untilEndOfPhase((ability) => ({
                    match: context.targets.second,
                    effect: ability.effects.modifyStrength(2)
                }));

                this.game.addMessage(
                    '{0} kneels {1} to give +2 STR to {2} and {3}',
                    context.player,
                    this,
                    context.targets.first,
                    context.targets.second
                );
            }
        });
    }
}

ArborQueen.code = '08084';

module.exports = ArborQueen;
