const GameAction = require('./GameAction');
const DeclareAttackers = require('./DeclareAttackers');
const DeclareDefenders = require('./DeclareDefenders');

class InitiateChallenge extends GameAction {
    constructor() {
        super('initiateChallenge');
    }

    createEvent({ challenge }) {
        return this.event('onChallengeInitiated', { challenge }, event => {
            event.challenge.initiateChallenge();

            if(event.challenge.declareDefendersFirst) {
                // Lysono Maar: When defenders are declared before attackers, they are knelt & considered "declared" within challenge initiation; same as declaring attackers
                event.thenAttachEvent(DeclareDefenders.createEvent({ cards: event.challenge.defenders, challenge: event.challenge }));
            }
            event.thenAttachEvent(DeclareAttackers.createEvent({ cards: event.challenge.declaredAttackers, challenge: event.challenge }));

            // Attaching custom initiation actions, such as stealth & assault
            event.challenge.initiationActions.forEach(initiationAction => event.thenAttachEvent(initiationAction.action.createEvent(initiationAction.properties)));

            event.thenExecute(event => {
                // Reapply effects which rely on being within a challenge (eg. The Lord of the Crossing)
                event.challenge.game.effectEngine.reapplyStateDependentEffects();
            });

            event.thenExecute(event => {
                // Recalculate challenge strength after effects have been reapplied (and before announcing initiating STR)
                event.challenge.calculateStrength();

                // Announce challenge opponent, type & STR. Adds defending STR if applicable (eg. Lysono Maar)
                challenge.game.addMessage('{0} has initiated a {1} challenge against {2} with strength {3}' + (challenge.defenders.length > 0 ? ', and {2} defending with strength {4}' : ''), 
                    challenge.attackingPlayer, challenge.challengeType, challenge.defendingPlayer, challenge.attackerStrength, challenge.defenderStrength);
            });
        });
    }
}

module.exports = new InitiateChallenge();
