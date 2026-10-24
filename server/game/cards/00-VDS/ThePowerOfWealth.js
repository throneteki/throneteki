import AgendaCard from '../../agendacard.js';
import GameActions from '../../GameActions/index.js';

class ThePowerOfWealth extends AgendaCard {
    // The Power of Wealth (00001)
    // When you announce The Power of Wealth as your agenda, name 1 faction. You may include cards
    // from that faction in your draw deck and plot deck.
    // Reduce the cost of the first in-faction card you marshal or play each round by 1.
    // Draft format only.
    setupCardAbilities(ability) {
        this.afterAgendasAnnounced({
            gameAction: GameActions.nameFaction({ count: 1 })
        });

        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.reduceFirstMarshalledOrPlayedCardCostEachRound(
                1,
                (card, context) => card.isFaction(context.source.controller.getFaction())
            )
        });
    }
}

ThePowerOfWealth.code = '00001';

export default ThePowerOfWealth;
