const DrawCard = require('../../drawcard.js');

class XaroXhoanDaxos extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card.getType() === 'attachment' && event.card.isUnique() &&
                                           event.playingType === 'marshal' && event.card.controller === this.controller
            },
            limit: ability.limit.perPhase(1),
            handler: () => {
                this.game.addGold(this.controller, 2);
                this.game.addMessage('{0} uses {1} to gain 2 gold', this.controller, this);
            }
        });
    }
}

XaroXhoanDaxos.code = '04093';

module.exports = XaroXhoanDaxos;
