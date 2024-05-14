const DrawCard = require('../../drawcard.js');

class DagmerCleftjaw extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onClaimApplied: (event) =>
                    event.challenge.isMatch({ winner: this.controller, attackingAlone: this })
            },
            target: {
                activePromptTitle: 'Select a location',
                source: this,
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'location' &&
                    card.getPrintedCost() <= 3 &&
                    !card.isLimited() &&
                    card.controller === this.game.currentChallenge.loser
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to take control of {2} instead of normal claim effects',
                    context.player,
                    this,
                    context.target
                );
                context.replaceHandler(() => {
                    this.game.takeControl(context.player, context.target);
                });
            }
        });
    }
}

DagmerCleftjaw.code = '02111';

module.exports = DagmerCleftjaw;
