import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Winterfell extends DrawCard {
    // Winterfell (03017)
    // Each [stark] character you control gets +1 STR.
    // Reaction: After a challenge is initiated, kneel Winterfell. Then, each player with a
    // non-Winter plot card revealed cannot trigger card abilities until the end of the challenge.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.isFaction('stark') && card.getType() === 'character',
            effect: ability.effects.modifyStrength(1)
        });

        this.reaction({
            when: {
                onChallengeInitiated: () => true
            },
            message: '{player} uses {source} to kneel {source}',
            gameAction: GameActions.kneelCard((context) => ({ card: context.source })).then({
                message:
                    'Then, each player with a non-Winter plot card revealed cannot trigger card abilities until the end of the challenge',
                gameAction: GameActions.lastingEffect(() => ({
                    duration: 'untilEndOfChallenge',
                    targetController: 'any',
                    match: (player) => !player.activePlot || !player.activePlot.hasTrait('Winter'),
                    effect: ability.effects.cannotTriggerCardAbilities()
                }))
            })
        });
    }
}

Winterfell.code = '03017';

export default Winterfell;
