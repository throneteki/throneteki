const DrawCard = require('../../drawcard.js');

const _ = require('underscore');

class MutinyAtCrastersKeep extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard character from play',
            phase: 'dominance',
            cost: ability.costs.sacrifice(card => card.getCost() === this.getHighestCharacterCost()),
            target: {
                cardCondition: card => card.location === 'play area' && card.controller !== this.controller &&
                                       card.getType() === 'character'
            },
            handler: context => {
                context.target.owner.discardCard(context.target);
                this.game.addMessage('{0} plays {1} and sacrifices {2} to discard {3} from play',
                    context.player, this, context.costs.sacrifice, context.target);
            }
        });
    }

    getHighestCharacterCost() {
        let charactersInPlay = this.controller.filterCardsInPlay(card => card.getType() === 'character');
        let costs = _.map(charactersInPlay, card => card.getCost());
        return _.max(costs);
    }
}

MutinyAtCrastersKeep.code = '06086';

module.exports = MutinyAtCrastersKeep;
