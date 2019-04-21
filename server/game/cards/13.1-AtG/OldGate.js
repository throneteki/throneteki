const DrawCard = require('../../drawcard.js');
const TextHelper = require('../../TextHelper');

class OldGate extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 1
        });
        this.action({
            title: 'Sacrifice to draw 2 cards',
            condition: context => this.allCharactersHaveStarkAffiliation(context.player),
            phase: 'challenge',
            cost: ability.costs.sacrificeSelf(),
            handler: () => {
                let cards = this.controller.drawCardsToHand(2).length;
                this.game.addMessage('{0} sacrifices {1} to draw {2}',
                    this.controller, this, TextHelper.count(cards, 'card'));
            }
        });
    }

    allCharactersHaveStarkAffiliation(player) {
        return (player.getNumberOfCardsInPlay(card => card.getType() === 'character')
            === player.getNumberOfCardsInPlay(card => card.getType() === 'character' && card.isFaction('stark')));
    }
}

OldGate.code = '13002';

module.exports = OldGate;
