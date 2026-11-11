import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class ParleyAtStormsEnd extends PlotCard {
    // Parley at Storm's End (14046)
    // When Revealed: Name a challenge type. Until you reveal a new plot card, challenges of that
    // type cannot be initiated.
    setupCardAbilities(ability) {
        this.whenRevealed({
            gameAction: GameActions.chooseChallengeType({
                message: '{player} uses {source} to prevent {challengeType} challenges',
                gameAction: (challengeType) =>
                    GameActions.lastingEffect((context) => ({
                        duration: 'custom',
                        until: {
                            onCardEntersPlay: (event) =>
                                event.card.getType() === 'plot' &&
                                event.card.controller === context.player
                        },
                        targetController: 'any',
                        effect: ability.effects.cannotInitiateChallengeType(challengeType)
                    }))
            })
        });
    }
}

ParleyAtStormsEnd.code = '14046';

export default ParleyAtStormsEnd;
