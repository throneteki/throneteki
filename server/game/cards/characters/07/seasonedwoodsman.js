const DrawCard = require('../../../drawcard.js');

class SeasonedWoodsman extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardAttached: event => event.parent === this
            },
            limit: ability.limit.perPhase(2),
            choices: {
                'Gain 1 gold': () => {
                    this.game.addGold(this.controller, 1);
                    this.game.addMessage('{0} uses {1} to gain 1 gold', this.controller, this);
                },
                'Draw 1 card': () => {
                    this.controller.drawCardsToHand(1);
                    this.game.addMessage('{0} uses {1} to draw 1 card', this.controller, this);
                }
            }
        });
    }
}

SeasonedWoodsman.code = '07015';

module.exports = SeasonedWoodsman;
