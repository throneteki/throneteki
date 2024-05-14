import DrawCard from '../../drawcard.js';

class JourneyToOldtown extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'plot'
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller === this.controller &&
                    card.getType() === 'character'
            },
            handler: (context) => {
                this.lastingEffect((ability) => ({
                    until: {
                        onPhaseStarted: (event) => event.phase === 'plot'
                    },
                    match: context.target,
                    targetLocation: ['play area', 'out of game'],
                    effect: ability.effects.removeFromGame()
                }));

                this.game.addMessage(
                    '{0} plays {1} to remove {2} from the game until the beginning of the next plot phase',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

JourneyToOldtown.code = '08026';

export default JourneyToOldtown;
