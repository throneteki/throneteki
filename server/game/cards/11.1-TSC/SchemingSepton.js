const DrawCard = require('../../drawcard');

class SchemingSepton extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw 1 card and gain 2 gold',
            phase: 'challenge',
            limit: ability.limit.perPhase(1),
            handler: () => {
                let numCardsDrawn = this.controller.drawCardsToHand(1).length;
                let goldGained = this.game.addGold(this.controller, 2);
                this.game.addMessage('{0} uses {1} to draw {2} card and gain {3} gold', this.controller, this, numCardsDrawn, goldGained);
                if(numCardsDrawn === 1 && goldGained === 2) {
                    this.controller.moveCard(this, 'draw deck');
                    this.game.addMessage('{0} then moves {1} to the top of their deck', this.controller, this);
                }
            }
        });
    }
}

SchemingSepton.code = '11004';

module.exports = SchemingSepton;
