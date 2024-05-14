const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class OldtownCityWatch extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            message: '{player} uses {source} to reveal the top card of each players deck',
            gameAction: GameActions.revealCards((context) => ({
                cards: context.game.getPlayers().map((player) => player.drawDeck[0])
            }))
        });
    }
}

OldtownCityWatch.code = '24023';

module.exports = OldtownCityWatch;
