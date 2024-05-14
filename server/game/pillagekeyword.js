const ChallengeKeywordAbility = require('./ChallengeKeywordAbility.js');
const GameActions = require('./GameActions');

class PillageKeyword extends ChallengeKeywordAbility {
    constructor() {
        super('Pillage', {
            gameAction: GameActions.discardTopCards((context) => ({
                player: context.challenge.loser,
                amount: this.getTriggerAmount(context),
                isPillage: true,
                source: context.source
            })).thenExecute((event) => {
                event.source.game.addMessage(
                    '{0} discards {1} from the top of their deck due to Pillage on {2}',
                    event.player,
                    event.topCards,
                    event.source
                );
            })
        });

        this.orderBy = 'prompt';
    }
}

module.exports = PillageKeyword;
