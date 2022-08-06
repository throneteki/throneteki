const PlotCard = require('../../plotcard');
const GameActions = require('../../GameActions');

class HeirToTheIronThrone extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            gameAction: GameActions.search({
                title: 'Select a character',
                topCards: 10,
                match: { type: 'character', trait: ['Lord', 'Lady'] },
                message: '{player} uses {source} to search their deck and put {searchTarget} into play',
                gameAction: GameActions.putIntoPlay(context => ({
                    player: context.player,
                    card: context.searchTarget
                })).then({
                    target: {
                        cardCondition: { type: 'character', trait: ['Lord', 'Lady'], controller: 'current' },
                        gameAction: 'sacrifice'
                    },
                    message: 'Then {player} sacrifices {target}',
                    handler: context => {
                        this.game.resolveGameAction(
                            GameActions.sacrificeCard(context => ({
                                player: context.player,
                                card: context.target
                            })),
                            context
                        );
                    }
                })
            })
        });
    }
}

HeirToTheIronThrone.code = '12048';

module.exports = HeirToTheIronThrone;
