import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AGameOfCyvasse extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'challenge'
            },
            target: {
                choosingPlayer: 'each',
                ifAble: true,
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.choosingPlayer &&
                    card.getType() === 'character' &&
                    GameActions.removeFromGame({ card }).allow()
            },
            message: {
                format: '{player} plays {source} to remove {targets} from the game until they win their next challenge',
                args: { targets: (context) => context.targets.getTargets() }
            },
            handler: (context) => {
                this.lastingEffect((ability) => ({
                    until: {
                        afterChallenge: (event) => event.challenge.winner === this.controller
                    },
                    match: context.targets.getTargets(),
                    targetLocation: ['play area', 'out of game'],
                    effect: ability.effects.removeFromGame()
                }));
            }
        });
    }
}

AGameOfCyvasse.code = '27547';
AGameOfCyvasse.version = '1.0.0';

export default AGameOfCyvasse;
