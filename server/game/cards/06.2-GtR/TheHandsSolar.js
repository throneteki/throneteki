import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class TheHandsSolar extends DrawCard {
    // The Hand's Solar (06030)
    // Action: Kneel The Hand's Solar to choose a character. Until the end of the phase, that
    // character gains an [intrigue] icon.
    setupCardAbilities(ability) {
        this.action({
            title: 'Give INT icon',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            message:
                '{player} kneels {source} to give {target} an intrigue icon until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.addIcon('intrigue')
            }))
        });
    }
}

TheHandsSolar.code = '06030';

export default TheHandsSolar;
