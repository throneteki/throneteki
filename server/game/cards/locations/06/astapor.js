const DrawCard = require('../../../drawcard.js');

class Astapor extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel to give character -STR',
            condition: () => this.game.currentChallenge,
            cost: ability.costs.kneelSelf(),
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => (
                    card.location === 'play area' && 
                    card.getType() === 'character' && 
                    this.game.currentChallenge.isParticipating(card))
            },
            handler: context => {
                this.untilEndOfChallenge(ability => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(-this.tokens['gold'])
                }));

                this.game.addMessage('{0} uses {1} to give {2} -{3} STR until the end of the challenge', 
                                      context.player, this, context.target, this.tokens['gold']);
            }
        });
    }
}

Astapor.code = '06054';

module.exports = Astapor;
