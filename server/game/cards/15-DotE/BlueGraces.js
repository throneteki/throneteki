const DrawCard = require('../../drawcard.js');

class BlueGraces extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Shuffle card back into deck',
            phase: 'challenge',
            cost: ability.costs.removeSelfFromGame(),
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: card => (card.location === 'discard pile' || card.location === 'dead pile') &&
                                       card.getPrintedCost() >= 6 && card.controller === this.controller
            },
            handler: context => {
                context.target.owner.moveCard(context.target, 'draw deck');
                context.target.owner.shuffleDrawDeck();
                this.game.addMessage('{0} removes {1} from the game to shuffle {2} back into their deck',
                    this.controller, this, context.target);
            }
        });
    }
}

BlueGraces.code = '15013';

module.exports = BlueGraces;
