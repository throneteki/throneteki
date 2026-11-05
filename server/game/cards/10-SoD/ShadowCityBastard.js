import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class ShadowCityBastard extends DrawCard {
    // Shadow City Bastard (10016)
    // Ambush (3).
    // Challenges Action: Sacrifice Shadow City Bastard to choose a character with printed cost 5 or
    // lower. Until the end of the phase, that characters loses a [military], an [intrigue], and a
    // [power] icon.
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove icons from character',
            phase: 'challenge',
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getPrintedCost() <= 5
            },
            message:
                '{player} sacrifices {source} to remove a military, an intrigue, and a power icon from {target} until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: [
                    ability.effects.removeIcon('military'),
                    ability.effects.removeIcon('intrigue'),
                    ability.effects.removeIcon('power')
                ]
            }))
        });
    }
}

ShadowCityBastard.code = '10016';

export default ShadowCityBastard;
