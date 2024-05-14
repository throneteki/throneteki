import DrawCard from '../../drawcard.js';

class ConsumingFlames extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give character -3 STR',
            cost: ability.costs.discardFromHand(
                (card) => card !== this && card.isFaction('targaryen')
            ),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isParticipating()
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} plays {1} and discards {2} from their hand to give {3} -3 STR until the end of the phase',
                    context.player,
                    this,
                    context.costs.discardFromHand,
                    context.target
                );

                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.killByStrength(-3)
                }));
            }
        });
    }
}

ConsumingFlames.code = '08034';

export default ConsumingFlames;
