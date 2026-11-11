import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class Winterfell extends DrawCard {
    // Winterfell (25104)
    // Reaction: After you win an unopposed challenge, kneel Winterfell to choose a character
    // controlled by the losing opponent. Until the end of the phase, take control of that
    // character.
    // -2 Initiative.
    setupCardAbilities(ability) {
        this.plotModifiers({
            initiative: -2
        });
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    event.challenge.isUnopposed()
            },
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: {
                    type: 'character',
                    location: 'play area',
                    condition: (card, context) => card.controller === context.event.challenge.loser
                }
            },
            message:
                '{player} kneels {costs.kneel} to take control of {target} until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.takeControl(context.player)
            }))
        });
    }
}

Winterfell.code = '25104';

export default Winterfell;
