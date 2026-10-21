import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class NightGathers extends DrawCard {
    // Night Gathers... (04046)
    // Marshaling Action: Choose an opponent whose reserve value is lower than yours. Until the end
    // of the phase, you may marshal characters from that player's discard pile as if they were in
    // your hand.
    setupCardAbilities(ability) {
        this.action({
            title: 'Allow marshaling from opponent discard',
            phase: 'marshal',
            chooseOpponent: (opponent) => opponent.getReserve() < this.controller.getReserve(),
            message:
                "{player} plays {source} to allow cards from {opponent}'s discard pile to be marshaled",
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                targetController: 'current',
                effect: ability.effects.canMarshal(
                    (card) =>
                        card.controller === context.opponent &&
                        card.location === 'discard pile' &&
                        card.getType() === 'character'
                )
            }))
        });
    }
}

NightGathers.code = '04046';

export default NightGathers;
