const DrawCard = require('../../../drawcard.js');

class BlackBetha extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.name === 'Ser Davos Seaworth',
            effect: ability.effects.addKeyword('renown')
        });
        this.action({
            title: 'Kneel to give attacking character +X STR',
            condition: () => this.game.currentChallenge && this.calculateStrength() >= 1,
            cost: ability.costs.kneelSelf(),
            target: {
                activePromptTitle: 'Select character to gain STR',
                cardCondition: card => this.game.currentChallenge.isAttacking(card)
            },
            handler: context => {
                var str = this.calculateStrength();

                this.untilEndOfChallenge(ability => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(str)
                }));

                this.game.addMessage('{0} kneels {1} to give {2} +{3} STR until the end of the challenge', context.player, this, context.target, str);
            }
        });
    }
    calculateStrength() {
        return this.game.allCards.reduce((counter, card) => {
            if(card === this || card.owner === this.game.currentChallenge.attackingPlayer || card.location !== 'play area' || card.getType() !== 'character' || !card.kneeled) {
                return counter;
            }
            return counter + 1;
        }, 0);
    }
}

BlackBetha.code = '07026';

module.exports = BlackBetha;
