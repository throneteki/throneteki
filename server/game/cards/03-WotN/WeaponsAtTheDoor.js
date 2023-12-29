const GameActions = require('../../GameActions/index.js');
const PlotCard = require('../../plotcard.js');

class WeaponsAtTheDoor extends PlotCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onPhaseStarted: event => event.phase === 'challenge'
            },
            message: '{player} uses {source} to force each player to return each card with printed attachment cardtype to their hand',
            gameAction: GameActions.simultaneously(context => 
                context.game.filterCardsInPlay(card => card.getPrintedType() === 'attachment' && card.parent && !card.facedown)
                    .map(card => GameActions.returnCardToHand({ card }))
            )
        });
    }
}

WeaponsAtTheDoor.code = '03051';

module.exports = WeaponsAtTheDoor;
