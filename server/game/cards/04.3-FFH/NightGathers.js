import DrawCard from '../../drawcard.js';

class NightGathers extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Allow marshaling from opponent discard',
            phase: 'marshal',
            chooseOpponent: (opponent) => opponent.getReserve() < this.controller.getReserve(),
            handler: (context) => {
                this.game.addMessage(
                    "{0} plays {1} to allow cards from {2}'s discard pile to be marshaled",
                    this.controller,
                    this,
                    context.opponent
                );
                this.untilEndOfPhase((ability) => ({
                    targetController: 'current',
                    effect: ability.effects.canMarshal(
                        (card) =>
                            card.controller === context.opponent &&
                            card.location === 'discard pile' &&
                            card.getType() === 'character'
                    )
                }));
            }
        });
    }
}

NightGathers.code = '04046';

export default NightGathers;
