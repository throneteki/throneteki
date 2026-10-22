import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class BattleBeneathTheWall extends PlotCard {
    // Battle Beneath the Wall (26059)
    // When Revealed: Name a challenge type. Until you reveal a new plot card, each player must
    // declare all eligible characters as attackers or defenders during challenges of that type.
    setupCardAbilities(ability) {
        this.whenRevealed({
            gameAction: GameActions.chooseChallengeType({
                message:
                    '{player} uses {source} to have all eligible characters declared as attackers and defenders during {challengeType} challenges until they reveal a new plot',
                gameAction: (challengeType) =>
                    GameActions.lastingEffect((context) => ({
                        duration: 'custom',
                        until: {
                            onCardEntersPlay: (event) =>
                                event.card.getType() === 'plot' &&
                                event.card.controller === context.player
                        },
                        condition: () => context.game.isDuringChallenge({ challengeType }),
                        match: (card) =>
                            card.location === 'play area' && card.getType() === 'character',
                        targetController: 'any',
                        effect: [
                            ability.effects.mustBeDeclaredAsAttacker(),
                            ability.effects.mustBeDeclaredAsDefender()
                        ]
                    }))
            })
        });
    }
}

BattleBeneathTheWall.code = '26059';

export default BattleBeneathTheWall;
