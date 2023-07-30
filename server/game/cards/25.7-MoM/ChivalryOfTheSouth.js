const GameActions = require('../../GameActions/index.js');
const PlotCard = require('../../plotcard.js');

class ChivalryOfTheSouth extends PlotCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onChallengeFinished: event => event.challenge.getParticipants().length === 0
            },
            message: '{player} uses {source} to gain 1 power for their faction',
            gameAction: GameActions.gainPower(context => ({ card: context.player.faction, amount: 1 }))
        });
    }
}

ChivalryOfTheSouth.code = '25596';
ChivalryOfTheSouth.version = '1.0';

module.exports = ChivalryOfTheSouth;
