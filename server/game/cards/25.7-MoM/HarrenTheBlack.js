const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class HarrenTheBlack extends DrawCard {
    setupCardAbilities() {
        this.attachmentRestriction({ type: 'location', unique: true });
        this.forcedReaction({
            when: {
                onCardDiscarded: event => event.isPillage && event.source.controller === this.controller
            },
            message: '{player} is forced by {source} to discard the top card of each players deck',
            gameAction: GameActions.simultaneously(context => context.game.getPlayersInFirstPlayerOrder().map(player => GameActions.discardTopCards({ player, amount: 1, source: this })))
        });
    }
}

HarrenTheBlack.code = '25521';
HarrenTheBlack.version = '1.0';

module.exports = HarrenTheBlack;
