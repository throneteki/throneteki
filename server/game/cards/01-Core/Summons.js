const PlotCard = require('../../plotcard.js');
const GameActions = require('../../GameActions');
const { context } = require('raven');

class Summons extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            gameAction: GameActions.search({
                topCards: 10,
                title: 'Selet a character',
                match: { type: 'character' },
                gameAction: GameActions.addToHand(context => ({
                    card: context.searchTarget,
                    fromLocation: 'draw deck'
                }))
            })
            // gameAction: GameActions.search({
            //     topCards: 10,
            //     title: 'Select a character',
            //     match: { type: 'character' },
            //     gameAction: GameActions.revealCards(context =>({
            //         cards: context.searchTarget,
            //         player: context.player
            //     })).then((revealContext, revealEvent) => ({
            //         gameAction: GameActions.addToHand({
            //             card: revealEvent.cards[0]//,
            //             // fromLocation: 'draw deck'
            //         })
            //     }))
            // })
        });
    }
}
Summons.code = '01022';

module.exports = Summons;
