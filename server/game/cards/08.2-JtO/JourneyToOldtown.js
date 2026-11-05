import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class JourneyToOldtown extends DrawCard {
    // Journey to Oldtown (08026)
    // Reaction: After the plot phase begins, choose a character you control. Remove it from the
    // game until the beginning of the next plot phase.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'plot'
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.player &&
                    card.getType() === 'character'
            },
            message:
                '{player} plays {source} to remove {target} from the game until the beginning of the next plot phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'custom',
                until: {
                    onPhaseStarted: (event) => event.phase === 'plot'
                },
                match: context.target,
                targetLocation: ['play area', 'out of game'],
                effect: ability.effects.removeFromGame()
            }))
        });
    }
}

JourneyToOldtown.code = '08026';

export default JourneyToOldtown;
