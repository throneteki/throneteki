const DrawCard = require('../../drawcard.js');

class MargaeryTyrell extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentChallenge && this.game.currentChallenge.isAttacking(this),
            match: this,
            effect: ability.effects.dynamicStrength(() => this.game.currentChallenge.defenders.length)
        });

        this.reaction({
            when: {
                onAttackersDeclared: event => event.challenge.isAttacking(this)
            },
            target: {
                cardCondition: card => card.location === 'play area' && card.getType() === 'character' &&
                                       card.controller === this.game.currentChallenge.defendingPlayer
            },
            handler: context => {
                context.target.controller.kneelCard(context.target);
                this.game.currentChallenge.addDefender(context.target);

                this.game.addMessage('{0} uses {1} to kneel {2} and have them participate in the current challenge as a defender',
                    this.controller, this, context.target);
            }
        });
    }
}

MargaeryTyrell.code = '09006';

module.exports = MargaeryTyrell;
