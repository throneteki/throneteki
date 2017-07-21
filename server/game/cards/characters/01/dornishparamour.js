const DrawCard = require('../../../drawcard.js');

class DornishParamour extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onAttackersDeclared: event => event.challenge.isAttacking(this)
            },
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => (
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller !== this.controller)
            },
            handler: context => {
                this.untilEndOfChallenge(ability => ({
                    match: context.target,
                    effect: ability.effects.mustBeDeclaredAsDefender()
                }));

                this.game.addMessage('{0} uses {1} to force {2} to be declared as a defender this challenge, if able', 
                    this.controller, this, context.target);
            }
        });
    }
}

DornishParamour.code = '01111';

module.exports = DornishParamour;
