const DrawCard = require('../../drawcard.js');
const TextHelper = require('../../TextHelper');

class RiverGate extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 1
        });
        this.action({
            title: 'Sacrifice to draw 2 cards',
            condition: context => this.hasLost2Challenges(context.player),
            phase: 'challenge',
            cost: ability.costs.sacrificeSelf(),
            handler: context => {
                let cards = context.player.drawCardsToHand(2).length;
                this.game.addMessage('{0} sacrifices {1} to draw {2}',
                    context.player, this, TextHelper.count(cards, 'card'));
            }
        });
    }

    hasLost2Challenges(player) {
        return player.challenges.countChallenges(challenge => challenge.loser === player) >= 2;
    }
}

RiverGate.code = '13016';

module.exports = RiverGate;
