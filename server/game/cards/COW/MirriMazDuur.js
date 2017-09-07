const DrawCard = require('../../drawcard.js');

class MirriMazDuur extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onClaimApplied: event => (
                    event.challenge.winner === this.controller &&
                    event.challenge.isAttacking(this) &&
                    event.challenge.attackers.length === 1
                )
            },
            handler: context => {
                context.skipHandler();
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select a character',
                    source: this,
                    cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.controller !== this.controller,
                    gameAction: 'kill',
                    onSelect: (p, card) => this.onCardSelected(p, card)
                });
            }
        });
    }

    onCardSelected(player, card) {
        this.game.addMessage('{0} uses {1} to kill {2} instead of normal claim effects', player, this, card);

        card.controller.killCharacter(card);

        return true;
    }
}

MirriMazDuur.code = '02093';

module.exports = MirriMazDuur;
