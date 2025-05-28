import GameAction from './GameAction.js';
import DeclareAttackers from './DeclareAttackers.js';
import DeclareDefenders from './DeclareDefenders.js';

class InitiateChallenge extends GameAction {
    constructor() {
        super('initiateChallenge');
    }

    createEvent({ challenge }) {
        // Steps of challenge initiation:
        // 1. Mark challenge as initiated
        // 2. Declare defenders (if applicable)
        // 3. Declare attackers
        // 4. Reapply effects which rely on being within a challenge (eg. The Lord of the Crossing)
        // 5. Announce challenge type, opponent & current STR
        // 6. Trigger challenge redirection (for Crown Regent)
        // 7. Apply initiation actions (eg. stealth, assault)
        return this.event('onChallengeInitiated', { challenge }, (event) => {
            event.challenge.initiateChallenge();

            if (event.challenge.declareDefendersFirst) {
                // Lysono Maar: When defenders are declared before attackers, they are knelt & considered "declared" within challenge initiation; same as declaring attackers
                event.thenAttachEvent(
                    DeclareDefenders.createEvent({
                        cards: event.challenge.defenders,
                        challenge: event.challenge
                    })
                );
            }
            event.thenAttachEvent(
                DeclareAttackers.createEvent({
                    cards: event.challenge.declaredAttackers,
                    challenge: event.challenge
                })
            );

            event.thenExecute((event) => {
                // Reapply effects which rely on being within a challenge (eg. The Lord of the Crossing)
                event.challenge.game.effectEngine.reapplyStateDependentEffects();
            });

            event.thenExecute((event) => {
                // Recalculate challenge strength after effects have been reapplied (and before announcing initiating STR)
                event.challenge.calculateStrength();

                // Announce challenge type, opponent & STR. Adds defending STR if applicable (eg. Lysono Maar)
                event.challenge.game.addMessage(
                    '{0} has initiated a {1} challenge against {2} with strength {3}' +
                        (challenge.defenders.length > 0
                            ? ', and {2} defending with strength {4}'
                            : ''),
                    challenge.attackingPlayer,
                    challenge.challengeType,
                    challenge.defendingPlayer,
                    challenge.attackerStrength,
                    challenge.defenderStrength
                );

                // Allow for challenge redirection (Crown Regent)
                const redirectEvent = this.event('onChallengeRedirectable', { challenge });
                event.thenAttachEvent(redirectEvent);

                // Must execute initiation actions (eg. stealth, assault) after challenge redirection
                // to ensure effects are applied to the newer redirected target(s), not the original ones
                redirectEvent.thenExecute((event) => {
                    event.challenge.initiationActions.forEach((initiationAction) =>
                        redirectEvent.thenAttachEvent(
                            initiationAction.action.createEvent(initiationAction.properties)
                        )
                    );
                });
            });
        });
    }
}

export default new InitiateChallenge();
