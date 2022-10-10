const DrawCard = require('../../drawcard.js');

class DefensiveDebris extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyStrength(1)
        });
        this.action({
            title: 'Discard gold to choose a discarded card',
            cost: ability.costs.discardGold(),
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: { location: 'discard pile', controller: 'opponent' }
            },
            phase: 'challenge',
            max: ability.limit.perPhase(1),
            message: {
                format: '{player} discards 1 gold from {source} and chooses {target} to prevent cards with printed cost {printedCost} from being played or entering play until the end of the phase',
                args: { printedCost: context => context.target.getPrintedCost() }
            },
            handler: context => {
                this.untilEndOfPhase(ability => ({
                    targetController: 'any',
                    effect: [
                        ability.effects.cannotPutIntoPlay(card => card.getPrintedCost() === context.target.getPrintedCost()),
                        ability.effects.cannotPlay(card => card.getPrintedCost() === context.target.getPrintedCost())
                    ]
                }));
            } 
        });
    }
}

DefensiveDebris.code = '23010';

module.exports = DefensiveDebris;
