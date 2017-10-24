const DrawCard = require('../../drawcard.js');

class LastHearth extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Increase character STR',
            condition: () => this.game.currentChallenge,
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: card => card.getType() === 'character' && card.isFaction('stark') && this.game.currentChallenge.isParticipating(card)
            },
            handler: context => {
                let strengthBonus = this.controller.getNumberOfUsedPlots() < 3 ? 3 : 2;
                this.game.addMessage('{0} kneels {1} to give {2} +{3} STR until the end of the challenge',
                    this.controller, this, context.target, strengthBonus);
                this.untilEndOfChallenge(ability => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(strengthBonus)
                }));
            }
        });
    }
}

LastHearth.code = '09036';

module.exports = LastHearth;
