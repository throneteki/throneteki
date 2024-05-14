const DrawCard = require('../../drawcard.js');

class TandaStokeworth extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this && event.playingType === 'marshal'
            },
            handler: () => {
                for (let player of this.game.getPlayers()) {
                    this.game.addGold(player, 3);
                }

                this.game.addMessage(
                    '{0} uses {1} to have each player gain 3 gold',
                    this.controller,
                    this
                );
            }
        });
    }
}

TandaStokeworth.code = '04069';

module.exports = TandaStokeworth;
