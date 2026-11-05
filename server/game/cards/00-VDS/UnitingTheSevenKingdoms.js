import AgendaCard from '../../agendacard.js';

class UnitingTheSevenKingdoms extends AgendaCard {
    // Uniting the Seven Kingdoms (00004)
    // You may include cards from any faction in your draw deck.
    // Increase the cost of each out-of-faction card you marshal or play by 1.
    // Draft format only.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.increaseCost({
                playingTypes: ['marshal', 'play'],
                amount: 1,
                match: (card) => card.isOutOfFaction()
            })
        });
    }
}

UnitingTheSevenKingdoms.code = '00004';

export default UnitingTheSevenKingdoms;
