import DrawCard from '../../drawcard.js';

class HosterTully extends DrawCard {
    // Hoster Tully (06001)
    // While Hoster Tully is participating in a challenge, each other participating House Tully
    // character you control gains renown.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isParticipating(),
            match: (card) =>
                card !== this && card.isParticipating() && card.hasTrait('House Tully'),
            effect: ability.effects.addKeyword('Renown')
        });
    }
}

HosterTully.code = '06001';

export default HosterTully;
