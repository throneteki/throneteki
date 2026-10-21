import { Tokens } from '../../Constants/index.js';
import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class BelligerentHeir extends DrawCard {
    // Belligerent Heir (25057)
    // Belligerent Heir gets +1 STR for each gold it has.
    // Reaction: After you initiate a challenge, place 1 gold from the treasury on an attacking
    // neutral character. If you lose the challenge, sacrifice that character. (Limit once per
    // phase.)
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength(() => this.tokens[Tokens.gold])
        });
        this.reaction({
            when: {
                onChallengeInitiated: (event) => event.challenge.attackingPlayer === this.controller
            },
            target: {
                type: 'select',
                cardCondition: {
                    type: 'character',
                    attacking: true,
                    faction: 'neutral',
                    controller: 'current'
                }
            },
            limit: ability.limit.perPhase(1),
            message: '{player} uses {source} to place 1 gold on {source}',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.placeToken((context) => ({
                        token: Tokens.gold,
                        card: context.target,
                        amount: 1
                    })),
                    context
                );

                this.game.once('afterChallenge:interrupt', (event) =>
                    this.resolveIfLose(event.challenge, context)
                );
            }
        });
    }

    resolveIfLose(challenge, context) {
        if (challenge.loser !== context.player) {
            return;
        }

        this.game.addMessage(
            '{0} is forced to sacrifice {1} due to {2}',
            context.target.controller,
            context.target,
            this
        );
        this.game.resolveGameAction(GameActions.sacrificeCard({ card: context.target }));
    }
}

BelligerentHeir.code = '25057';

export default BelligerentHeir;
