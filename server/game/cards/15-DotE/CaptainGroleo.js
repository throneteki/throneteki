const DrawCard = require('../../drawcard');

class CaptainGroleo extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card.getType() === 'attachment' && this.controller.canGainGold()
            },
            message: '{player} uses {source} to gain 1 gold',
            handler: () => {
                this.game.addGold(this.controller, 1);
            },
            limit: ability.limit.perPhase(1)
        });
    }
}

CaptainGroleo.code = '15012';

module.exports = CaptainGroleo;
