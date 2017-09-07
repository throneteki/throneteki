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
            handler: context => {
                context.skipHandler();
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select a location',
                    source: this,
                    cardCondition: card => (
                        card.location === 'play area' &&
                        card.getType() === 'location' &&
                        card.getCost() <= 3 &&
                        !card.isLimited() &&
                        card.controller !== this.controller),
                    onSelect: (p, card) => this.onCardSelected(p, card)
                });
            }
        });
    }

    onCardSelected(player, card) {
        this.game.takeControl(player, card);
        this.game.addMessage('{0} uses {1} to take control of {2} instead of normal claim effects', player, this, card);

        return true;
    }
}

DagmerCleftjaw.code = '02111';

module.exports = DagmerCleftjaw;
