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
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.addIcon('intrigue')
                }));

                this.game.addMessage(
                    '{0} kneels {1} to give {2} an {3} icon until the end of the phase',
                    this.controller,
                    this,
                    context.target,
                    'intrigue'
                );
            }
        });
    }
}

TheHandsSolar.code = '06030';

export default TheHandsSolar;
