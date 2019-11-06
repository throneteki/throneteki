const PlotCard = require('../../plotcard');
const GameActions = require('../../GameActions');

class ThePrinceWhoCameTooLate extends PlotCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search your deck',
            phase: 'standing',
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.search({
                        title: 'Select a character',
                        match: { type: 'character' },
                        message: '{player} uses {source} to search their deck and put {searchTarget} into play',
                        cancelMessage: '{player} uses {source} to search their deck but does not find a card',
                        gameAction: GameActions.putIntoPlay(context => ({
                            player: context.player,
                            card: context.searchTarget
                        }))
                    }),
                    context
                );
            },
            limit: ability.limit.perRound(1)
        });
    }
}

ThePrinceWhoCameTooLate.code = '15052';

module.exports = ThePrinceWhoCameTooLate;
