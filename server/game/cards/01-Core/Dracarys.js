import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class Dracarys extends DrawCard {
    // Dracarys! (01176)
    // Action: Kneel a Dragon character or Daenerys Targaryen to choose a participating character.
    // Until the end of the phase, that character gets -4 STR and is killed if its STR is 0.
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce character STR by 4',
            condition: (context) => context.game.isDuringChallenge(),
            cost: ability.costs.kneel(
                (card) =>
                    card.name === 'Daenerys Targaryen' ||
                    (card.hasTrait('Dragon') && card.getType() === 'character')
            ),
            target: {
                cardCondition: (card) => card.location === 'play area' && card.isParticipating()
            },
            message:
                '{player} plays {source} to kneel {costs.kneel} and give {target} -4 STR until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.killByStrength(-4)
            }))
        });
    }
}

Dracarys.code = '01176';

export default Dracarys;
