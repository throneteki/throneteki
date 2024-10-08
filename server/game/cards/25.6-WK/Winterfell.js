import DrawCard from '../../drawcard.js';

class Winterfell extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            initiative: -2
        });
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && event.challenge.isUnopposed()
            },
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: {
                    type: 'character',
                    condition: (card, context) => card.controller === context.event.challenge.loser
                }
            },
            message:
                '{player} kneels {costs.kneel} to take control of {target} until the end of the phase',
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.takeControl(this.controller)
                }));
            }
        });
    }
}

Winterfell.code = '25104';

export default Winterfell;
