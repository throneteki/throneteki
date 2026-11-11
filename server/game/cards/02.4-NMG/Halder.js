import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class Halder extends DrawCard {
    // Halder (02065)
    // No attachments except Weapon.
    // Action: Kneel a [thenightswatch] location or attachment to choose a [thenightswatch]
    // character. Until the end of the phase, that character gets +1 STR.
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel a location or attachment',
            cost: ability.costs.kneel(
                (card) =>
                    card.isFaction('thenightswatch') &&
                    (card.getType() === 'attachment' || card.getType() === 'location')
            ),
            target: {
                cardCondition: (card) =>
                    card.isFaction('thenightswatch') &&
                    card.getType() === 'character' &&
                    card.location === 'play area'
            },
            message:
                '{player} uses {source} and kneels {costs.kneel} to give {target} +1 STR until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.modifyStrength(1)
            }))
        });
    }
}

Halder.code = '02065';

export default Halder;
