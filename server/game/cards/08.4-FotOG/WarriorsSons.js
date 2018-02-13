const DrawCard = require('../../drawcard.js');

class WarriorsSons extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardPlayed: event => event.player !== this.controller && this.game.currentChallenge &&
                                       this.game.currentChallenge.isParticipating(this) && event.player.faction.power > 0
            },
            handler: context => {
                this.game.movePower(context.event.player.faction, this, 1);
                this.game.addMessage('{0} moves 1 power from {1}\'s faction card to {2}',
                    context.player, context.event.player, this);
            }
        });
    }
}

WarriorsSons.code = '08077';

module.exports = WarriorsSons;
