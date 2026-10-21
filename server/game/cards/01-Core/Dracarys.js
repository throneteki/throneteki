import DrawCard from '../../drawcard.js';

class Dracarys extends DrawCard {
    // Dracarys! (01176)
    // Action: Kneel a Dragon character or Daenerys Targaryen to choose a participating character.
    // Until the end of the phase, that character gets -4 STR and is killed if its STR is 0.
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce character STR by 4',
            condition: () => this.game.isDuringChallenge(),
            cost: ability.costs.kneel(
                (card) =>
                    card.name === 'Daenerys Targaryen' ||
                    (card.hasTrait('Dragon') && card.getType() === 'character')
            ),
            target: {
                cardCondition: (card) => card.location === 'play area' && card.isParticipating()
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} plays {1} to kneel {2} and give {3} -4 STR until the end of the phase',
                    context.player,
                    this,
                    context.costs.kneel,
                    context.target
                );
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.killByStrength(-4)
                }));
            }
        });
    }
}

Dracarys.code = '01176';

export default Dracarys;
