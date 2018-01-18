const DrawCard = require('../../drawcard.js');

class AbandonedStronghold extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give character +STR',
            condition: () => this.game.currentChallenge,
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: card => (
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    this.game.currentChallenge.isDefending(card))
            },
            handler: context => {
                let strBoost = this.getNumberOfBuilders();
                this.untilEndOfChallenge(ability => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(strBoost)
                }));

                this.game.addMessage('{0} kneels {1} to give {2} +{3} STR until the end of the challenge',
                    context.player, this, context.target, strBoost);
            }
        });
    }

    getNumberOfBuilders() {
        return this.controller.getNumberOfCardsInPlay(card => card.controller === this.controller && card.hasTrait('Builder') && card.getType() === 'character');
    }
}

AbandonedStronghold.code = '07018';

module.exports = AbandonedStronghold;
