const DrawCard = require('../../drawcard.js');
const {Tokens} = require('../../Constants');
const GameActions = require('../../GameActions/index.js');

class Varys extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: [
                ability.effects.cannotMarshal(card => card.getPrintedCost() === this.tokens[Tokens.gold]),
                ability.effects.cannotPlay(card => card.getPrintedCost() === this.tokens[Tokens.gold]),
                ability.effects.cannotPutIntoPlay(card => card.getPrintedCost() === this.tokens[Tokens.gold])
            ]
        });
        this.reaction({
            when: {
                onPlotRevealed: event => event.plot.controller === this.controller && event.plot.hasTrait('Scheme')
            },
            choices: {
                'Place gold': {
                    message: '{player} uses {source} to place 1 gold on {source}',
                    gameAction: GameActions.placeToken({ card: this, token: Tokens.gold })
                },
                'Discard gold': {
                    message: '{player} uses {source} to discard 1 gold from {source}',
                    gameAction: GameActions.discardToken({ card: this, token: Tokens.gold })
                }
            }
        });
    }
}

Varys.code = '25600';
Varys.version = '1.0';

module.exports = Varys;
