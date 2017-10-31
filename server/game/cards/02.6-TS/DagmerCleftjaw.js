const DrawCard = require('../../drawcard.js');

class DagmerCleftjaw extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onClaimApplied: event => (
                    event.challenge.winner === this.controller &&
                    event.challenge.isAttacking(this) &&
                    event.challenge.attackers.length === 1)
            },
            target: {
                activePromptTitle: 'Select a location',
                source: this,
                cardCondition: card => (
                    card.location === 'play area' &&
                    card.getType() === 'location' &&
                    card.getCost() <= 3 &&
                    !card.isLimited() &&
                    card.controller === this.game.currentChallenge.loser)
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to take control of {2} instead of normal claim effects', context.player, this, context.target);
                context.replaceHandler(() => {
                    this.game.takeControl(context.player, context.target);
                });
            }
        });
    }
}

DagmerCleftjaw.code = '02111';

module.exports = DagmerCleftjaw;
