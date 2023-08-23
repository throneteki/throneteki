const GameActions = require('../../GameActions');
const PlotCard = require('../../plotcard');

class BurningTheBooks extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.getType() === 'plot' && card.location === 'revealed plots' && card.controller !== this.controller,
            targetController: 'any',
            effect: ability.effects.fullBlank
        });

        this.whenRevealed({
            target: {
                choosingPlayer: 'each',
                ifAble: true,
                activePromptTitle: 'Select an attachment',
                cardCondition: { location: 'play area', controller: 'choosingPlayer', type: 'attachment', not: { trait: 'The Seven' } },
                gameAction: 'removeFromGame'
            },
            message: '{player} uses {source} to remove {target} from the game',
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.simultaneously(context => 
                        context.targets.getTargets().map(card => GameActions.removeFromGame({ card, allowSave: false }))
                    ), 
                    context
                );
            }
        });
    }
}

BurningTheBooks.code = '25613';
BurningTheBooks.version = '1.0';

module.exports = BurningTheBooks;
