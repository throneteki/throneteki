const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class AllardSeaworth extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard facedown card',
            phase: 'dominance',
            cost: ability.costs.discardFromPlay(card => card.facedown && card.getType() === 'attachment' && card.parent && card.parent.controller === this.controller && card.parent.isFaction('baratheon')),
            limit: ability.limit.perPhase(2),
            message: {
                format: '{player} uses {source} and discards {costs.discardFromPlay} from {parent} to gain 1 power for their faction',
                args: { parent: context => context.costs.discardFromPlay.parent }
            },
            gameAction: GameActions.gainPower(context => ({ card: context.player.faction, amount: 1 }))
        });
    }
}

AllardSeaworth.code = '25503';
AllardSeaworth.version = '1.0';

module.exports = AllardSeaworth;
