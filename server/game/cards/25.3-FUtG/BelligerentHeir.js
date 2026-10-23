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
            match: (card, context) => card === context.source,
            effect: ability.effects.dynamicStrength((card) => card.tokens[Tokens.gold] || 0)
        });
        this.reaction({
            when: {
                onChallengeInitiated: (event, context) =>
                    event.challenge.attackingPlayer === context.player
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
            message: '{player} uses {source} to place 1 gold on {target}',
            gameAction: GameActions.simultaneously([
                GameActions.placeToken((context) => ({
                    token: Tokens.gold,
                    card: context.target,
                    amount: 1
                })),
                GameActions.delayedEffect({
                    duration: 'untilEndOfChallenge',
                    when: {
                        afterChallenge: (event, context) => event.challenge.loser === context.player
                    },
                    message: '{player} is forced to sacrifice {target} due to {source}',
                    gameAction: GameActions.sacrificeCard((context) => ({ card: context.target }))
                })
            ])
        });
    }
}

BelligerentHeir.code = '25057';

export default BelligerentHeir;
