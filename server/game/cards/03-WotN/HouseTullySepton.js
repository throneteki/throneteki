import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class HouseTullySepton extends DrawCard {
    // House Tully Septon (03015)
    // Marshaling Action: Discard 1 power from a character you control to reduce the cost of the
    // next House Tully or The Seven character you marshal this phase by 2. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce next marshalled character',
            clickToActivate: true,
            phase: 'marshal',
            limit: ability.limit.perPhase(1),
            cost: ability.costs.discardPower(1, (card) => card.getType() === 'character'),
            message:
                '{player} uses {source} and discards a power from {costs.discardPower} to reduce the cost of the next House Tully or The Seven character they marshal this phase by 2',
            gameAction: GameActions.lastingEffect(() => ({
                duration: 'untilEndOfPhase',
                effect: ability.effects.reduceNextMarshalledCardCost(
                    2,
                    (card) =>
                        (card.hasTrait('House Tully') || card.hasTrait('The Seven')) &&
                        card.getType() === 'character'
                )
            }))
        });
    }
}

HouseTullySepton.code = '03015';

export default HouseTullySepton;
