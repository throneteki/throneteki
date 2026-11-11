import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class SeaDragonTower extends DrawCard {
    // Sea Dragon Tower (10026)
    // Challenges Action: Kneel Sea Dragon Tower to choose a character. Until the end of the phase,
    // that character gains a [power] icon.
    setupCardAbilities(ability) {
        this.action({
            title: 'Give power icon',
            phase: 'challenge',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            message: '{player} kneels {source} to give a power icon to {target}',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.addIcon('power')
            }))
        });
    }
}

SeaDragonTower.code = '10026';

export default SeaDragonTower;
