const GameAction = require('./GameAction');
const GameActions = require('./index');

/*
Assault is a keyword ability.
When a player initiates a challenge and 1 or more characters with assault are declared as attackers,
that player may choose one location controlled by the defending player with a printed cost lower than the highest printed cost 
among attacking characters with assault.
Treat the chosen location as if its printed text box were blank (except for Traits) until the end of the challenge.
If you win this challenge, kneel it.
*/
class AssaultKeywordAction extends GameAction {
    constructor() {
        super('assault');
    }

    canChangeGameState({ challenge, source, target }) {
        return (
            source.isAssault() &&
            target.controller === challenge.defendingPlayer &&
            target.location === 'play area' &&
            target.getType() === 'location' &&
            (source.challengeOptions.contains('ignoresAssaultLocationCost') || target.getPrintedCost() < source.getPrintedCost()) &&
            target.allowGameAction(this.name)
        );
    }

    createEvent({ challenge, source, target }) {
        return this.event('onAssaulted', { challenge, source, target }, () => {
            source.untilEndOfChallenge(ability => ({
                match: target,
                effect: ability.effects.blankExcludingTraits
            }));
            challenge.game.once('afterChallenge', event => {
                if(event.challenge.winner === source.controller && target.allowGameAction('kneel')) {
                    challenge.game.addMessage('{0} kneels {1} due to assault', source.controller, target);
                    challenge.game.resolveGameAction(GameActions.kneelCard({ card: target, source: source, cause: 'assault' }));
                }
            });
        });
    }
}

module.exports = new AssaultKeywordAction();
