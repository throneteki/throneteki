const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class TheWatchHasNeed extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Search for a character',
            condition: () => this.controller.getTotalReserve() > 0,
            message: {
                format: '{player} plays {source} to name a trait and search the top {reserve} cards of their deck',
                args: { reserve: context => context.player.getTotalReserve() }
            },
            gameAction: GameActions.choose({
                player: () => this.controller,
                title: 'Select a trait',
                message: '{choosingPlayer} names the {choice} trait',
                choices: {
                    'Builder': this.gameActionForTrait('Builder'),
                    'Ranger': this.gameActionForTrait('Ranger'),
                    'Steward': this.gameActionForTrait('Steward')
                }
            })
        });
    }

    gameActionForTrait(trait) {
        return GameActions.genericHandler(context => {
            let reserve = context.player.getTotalReserve();

            this.game.resolveGameAction(
                GameActions.search({
                    title: 'Select a character',
                    match: { trait: trait },
                    numToSelect: reserve,
                    topCards: reserve,
                    message: '{player} adds {searchTarget} to their hand',
                    gameAction: GameActions.simultaneously(context => context.searchTarget.map(card => GameActions.addToHand({ card })))
                }), 
                context
            );
        });
    }
}

TheWatchHasNeed.code = '02002';

module.exports = TheWatchHasNeed;
