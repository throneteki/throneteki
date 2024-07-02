import DrawCard from '../../drawcard.js';

class OlennasWheelhouse extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove a character from game',
            cost: [ability.costs.kneelSelf(), ability.costs.discardGold()],
            phase: 'marshal',
            target: {
                cardCondition: { location: 'play area', faction: 'tyrell', controller: 'current' }
            },
            message:
                '{player} kneels {costs.kneel} and discards 1 gold from it to remove {target} from the game until the beginning of the next phase',
            handler: (context) => {
                this.lastingEffect((ability) => ({
                    until: {
                        onPhaseStarted: () => true
                    },
                    match: context.target,
                    targetLocation: ['play area', 'out of game'],
                    effect: ability.effects.removeFromGame()
                }));
            }
        });
    }
}

OlennasWheelhouse.code = '25076';

export default OlennasWheelhouse;
