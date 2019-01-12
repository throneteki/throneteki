const DrawCard = require('../../drawcard.js');
const TextHelper = require('../../TextHelper');

class GateOfTheGods extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 1
        });
        this.action({
            title: 'Sacrifice to draw 2 cards',
            condition: () => this.characterWithHighestStrength(),
            phase: 'challenge',
            cost: ability.costs.sacrificeSelf(),
            handler: () => {
                let cards = this.controller.drawCardsToHand(2).length;
                this.game.addMessage('{0} sacrifices {1} to draw {2}', 
                    this.controller, this, TextHelper.count(cards, 'card'));
            }
        });
    }

    characterWithHighestStrength() {
        let charactersInPlay = this.game.filterCardsInPlay(card => card.getType() === 'character');
        let strengths = charactersInPlay.map(card => card.getStrength());
        let highestStrength = Math.max(...strengths);

        return this.controller.anyCardsInPlay(card => card.getType() === 'character' && card.getStrength() >= highestStrength);
    }
}

GateOfTheGods.code = '13004';

module.exports = GateOfTheGods;
