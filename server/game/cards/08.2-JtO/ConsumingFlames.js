import DrawCard from '../../drawcard.js';

class ConsumingFlames extends DrawCard {
    // Consuming Flames (08034)
    // Challenges Action: Discard another [targaryen] card from your hand to choose a participating
    // character. Until the end of the phase, that character gets -3 STR and is killed if its STR is
    // 0.
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
