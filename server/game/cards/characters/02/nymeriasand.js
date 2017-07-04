const DrawCard = require('../../../drawcard.js');

class NymeriaSand extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove and gain icon',
            limit: ability.limit.perPhase(1),
            phase: 'challenge',
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => card.location === 'play area' && card.controller !== this.controller &&
                                       card.getType() === 'character'
            },
            handler: context => {
                this.game.promptForIcon(this.controller, icon => {
                    this.untilEndOfPhase(ability => ({
                        match: context.target,
                        effect: ability.effects.removeIcon(icon)
                    }));

                    this.untilEndOfPhase(ability => ({
                        match: card => card.getType() === 'character' && card.hasTrait('Sand Snake'),
                        effect: ability.effects.addIcon(icon)
                    }));

                    this.game.addMessage('{0} uses {1} to remove {2} {3} icon from {4} and have each Sand Snake character they control gain it', 
                                          this.controller, this, icon === 'intrigue' ? 'an' : 'a', icon, context.target);
                });
            }
        });
    }
}

NymeriaSand.code = '02035';

module.exports = NymeriaSand;
