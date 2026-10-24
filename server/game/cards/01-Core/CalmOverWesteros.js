import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class CalmOverWesteros extends PlotCard {
    // Calm Over Westeros (01008)
    // When Revealed: Name a challenge type. Until you reveal a new plot card, reduce the claim
    // value on the attacking player's revealed plot card by 1 during challenges of that type in
    // which you are the defending player.
    setupCardAbilities(ability) {
        this.whenRevealed({
            gameAction: GameActions.chooseChallengeType({
                message:
                    '{player} uses {source} to reduce the claim value of {challengeType} challenges in which they are the defending player by 1 until they reveal a new plot',
                gameAction: (challengeType) =>
                    GameActions.lastingEffect((context) => ({
                        duration: 'custom',
                        until: {
                            onCardEntersPlay: (event) =>
                                event.card.getType() === 'plot' &&
                                event.card.controller === context.player
                        },
                        condition: () =>
                            context.game.isDuringChallenge({
                                challengeType,
                                defendingPlayer: context.player
                            }),
                        match: (card) =>
                            context.game.currentChallenge &&
                            card === context.game.currentChallenge.attackingPlayer.activePlot,
                        targetController: 'any',
                        effect: ability.effects.modifyClaim(-1)
                    }))
            })
        });
    }
}

CalmOverWesteros.code = '01008';

export default CalmOverWesteros;
