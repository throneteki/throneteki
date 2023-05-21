const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class TheFieldOfFire extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give non-Dragon\'s -STR',
            phase: 'challenge',
            message: {
                format: '{player} plays {source} to have each non-Dragon character without attachments get {reduction} STR until the end of the phase',
                args: { reduction: context => this.getReductionAmount(context.player) }
            },
            max: ability.limit.perPhase(1),
            gameAction: GameActions.genericHandler(context => {
                this.untilEndOfPhase(ability => ({
                    match: context.game.filterCardsInPlay(card => card.getType() === 'character' && !card.hasTrait('Dragon') && card.attachments.length === 0),
                    targetController: 'any',
                    effect: ability.effects.modifyStrength(this.getReductionAmount(context.player))
                }));
            })
        });
    }

    getReductionAmount(player) {
        return player.getNumberOfCardsInPlay({ trait: 'Dragon', type: 'character', controller: 'current', location: 'play area', printedCostOrHigher: 7 }) * -1;
    }
}

TheFieldOfFire.code = '24021';

module.exports = TheFieldOfFire;
