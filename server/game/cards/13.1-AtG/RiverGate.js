const DrawCard = require('../../drawcard.js');
const TextHelper = require('../../TextHelper');

class RiverGate extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 1
        });
        this.action({
            title: 'Sacrifice to draw 2 cards',
            condition: () => this.hasLost2Challenges(),
            phase: 'challenge',
            cost: ability.costs.sacrificeSelf(),
            handler: () => {
                let cards = this.controller.drawCardsToHand(2).length;
                this.game.addMessage('{0} sacrifices {1} to draw {2}',
                    this.controller, this, TextHelper.count(cards, 'card'));
            }
        });
    }

    hasLost2Challenges() {
        return this.controller.challenges.countChallenges(challenge => challenge.loser === this.controller) >= 2;
    }
}

RiverGate.code = '13016';

module.exports = RiverGate;
