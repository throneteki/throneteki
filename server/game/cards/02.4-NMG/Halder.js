import DrawCard from '../../drawcard.js';

class Halder extends DrawCard {
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
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} and kneels {2} to give {3} +1 STR until the end of the phase',
                    this.controller,
                    this,
                    context.costs.kneel,
                    context.target
                );

                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(1)
                }));
            }
        });
    }
}

Halder.code = '02065';

export default Halder;
