const PlotCard = require('../../plotcard');
const GameActions = require('../../GameActions');

class HeirToTheIronThrone extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            message: '{player} uses {source} to search the top 10 cards of their deck for a Lord or Lady character',
            gameAction: GameActions.search({
                title: 'Select a character',
                match: { type: 'character', trait: ['Lord', 'Lady'] },
                topCards: 10,
                reveal: false,
                message: '{player} {gameAction}',
                gameAction: GameActions.putIntoPlay(context => ({
                    card: context.searchTarget
                })).then({
                    condition: context => context.parentContext.searchTarget.location === 'play area',
                    activePromptTitle: 'Select character to sacrifice',
                    target: {
                        cardCondition: { type: 'character', trait: ['Lord', 'Lady'], location: 'play area', controller: 'current' },
                        gameAction: 'sacrifice'
                    },
                    message: 'Then, {player} sacrifices {target}',
                    handler: context => {
                        this.game.resolveGameAction(GameActions.sacrificeCard(context => ({ card: context.target })), context);
                    }
                })
            })
        });
    }
}

HeirToTheIronThrone.code = '12048';

module.exports = HeirToTheIronThrone;
