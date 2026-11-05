import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ChoosingTheSpear extends DrawCard {
    // Choosing the Spear (15032)
    // Reaction: After a [martell] character you control is declared as an attacker in a [military]
    // challenge, raise the claim value on your revealed plot card by 1 until the end of the
    // challenge. If you lose the challenge, choose and kill a character you control. (Max 1 per
    // challenge.)
    setupCardAbilities(ability) {
        this.reaction({
            max: ability.limit.perChallenge(1),
            when: {
                onDeclaredAsAttacker: (event, context) =>
                    event.card.controller === context.player &&
                    event.card.isFaction('martell') &&
                    event.challenge.challengeType === 'military' &&
                    event.card.getType() === 'character'
            },
            message:
                '{player} plays {source} to raise the claim value on their revealed plot card by 1 until the end of the challenge',
            gameAction: GameActions.simultaneously([
                GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfChallenge',
                    match: (card) => card === context.player.activePlot,
                    effect: ability.effects.modifyClaim(1)
                })),
                GameActions.delayedEffect({
                    duration: 'untilEndOfChallenge',
                    when: {
                        afterChallenge: (event, context) => event.challenge.loser === context.player
                    },
                    message: '{source} forces {player} to kill a character they control',
                    gameAction: GameActions.chooseCards({
                        title: 'Select a character to kill',
                        cardCondition: (card, context) =>
                            card.location === 'play area' &&
                            card.controller === context.player &&
                            card.getType() === 'character',
                        gameAction: (card) => GameActions.kill({ card })
                    })
                })
            ])
        });
    }
}

ChoosingTheSpear.code = '15032';

export default ChoosingTheSpear;
