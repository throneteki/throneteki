const DrawCard = require('../../drawcard.js');
const {Tokens} = require('../../Constants');
const GameActions = require('../../GameActions/index.js');

class Varys extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Name a card',
            cost: ability.costs.discardGold(),
            message: '{player} discards 1 gold from {source} to name a card',
            handler: context => {
                this.game.promptForCardName({
                    player: context.player,
                    onSelect: (player, cardName) => this.selectCardName(cardName),
                    source: context.source
                });
            }
        });
    }

    selectCardName(cardName) {
        this.game.addMessage('Until the end of the phase, {0} cannot be played or enter play', cardName);
        this.untilEndOfPhase(ability => ({
            targetController: 'any',
            effect: [
                ability.effects.cannotMarshal(card => card.name.toLowerCase() === cardName.toLowerCase()),
                ability.effects.cannotPlay(card => card.name.toLowerCase() === cardName.toLowerCase()),
                ability.effects.cannotPutIntoPlay(card => card.name.toLowerCase() === cardName.toLowerCase())
            ]
        }));

        this.reaction({
            when: {
                onPlotRevealed: event => event.plot.hasTrait('Scheme')
            },
            message: '{player} uses {source} to place 1 gold on {source}',
            gameAction: GameActions.placeToken({ card: this, token: Tokens.gold })
        });
    }
}

Varys.code = '25600';
Varys.version = '1.1';

module.exports = Varys;
