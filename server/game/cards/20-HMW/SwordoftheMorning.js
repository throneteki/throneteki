const DrawCard = require('../../drawcard.js');

class SwordoftheMorning extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction(
            { faction: 'martell', unique: true },
            { trait: 'House Dayne' }
        );
        this.whileAttached({
            condition: () => this.parent.isAttacking(),
            effect: ability.effects.dynamicStrength(() => this.getDefendingCharacters())
        });
        
        this.reaction({
            when: {
                onDeclaredAsAttacker: event => event.card === this.parent
            },
            target: {
                mode: 'upTo',
                numCards: 3,
                cardCondition: card => card.location === 'play area' && card.getType() === 'character' &&
                                       card.controller === this.game.currentChallenge.defendingPlayer
            },
            handler: context => {
                this.untilEndOfChallenge(ability => ({
                    match: context.target,
                    targetController: 'any',
                    effect: ability.effects.mustBeDeclaredAsDefender()
                }));

                this.game.addMessage('{0} uses {1} to force {2} to be declared as a defender this challenge, if able',
                    context.player, this, context.target);
            }
        });
    }

    getDefendingCharacters() {
        if(!this.game.isDuringChallenge()) {
            return 0;
        }

        return this.game.currentChallenge.defenders.length;
    }
}

SwordoftheMorning.code = '20018';

module.exports = SwordoftheMorning;
