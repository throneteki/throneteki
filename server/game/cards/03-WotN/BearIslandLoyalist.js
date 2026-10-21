import DrawCard from '../../drawcard.js';

class BearIslandLoyalist extends DrawCard {
    // Bear Island Loyalist (03012)
    // While Bear Island Loyalist is participating in a challenge, each other participating [stark]
    // character you control gains "immune to opponents' events."
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isParticipating(),
            match: (card) => this.isOtherParticipatingStark(card),
            effect: ability.effects.immuneTo(
                (card) => card.controller !== this.controller && card.getType() === 'event'
            )
        });
    }

    isOtherParticipatingStark(card) {
        return (
            card.isParticipating() &&
            card.controller === this.controller &&
            card.isFaction('stark') &&
            card !== this
        );
    }
}

BearIslandLoyalist.code = '03012';

export default BearIslandLoyalist;
