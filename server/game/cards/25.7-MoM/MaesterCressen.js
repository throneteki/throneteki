const DrawCard = require('../../drawcard');

class MaesterCressen extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: event => event.card === this && this.controller.agenda,
                onCharacterKilled: event => event.card === this && this.controller.agenda
            },
            message: '{player} uses {source} to place the top 2 cards of their deck under their agenda',
            handler: context => {
                const topCards = context.player.drawDeck.slice(0, 2);
                for(const card of topCards) {
                    context.player.moveCard(card, 'conclave');
                }
            }
        });
    }
}

MaesterCressen.code = '25504';
MaesterCressen.version = '1.0';

module.exports = MaesterCressen;
