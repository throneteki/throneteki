import DrawCard from '../../drawcard.js';

class OwenTheOaf extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isParticipating(),
            match: (card) =>
                card.isParticipating() &&
                card.getType() === 'character' &&
                card.getNumberOfIcons() > 1,
            targetController: 'any',
            effect: ability.effects.doesNotContributeStrength()
        });
    }
}

OwenTheOaf.code = '13025';

export default OwenTheOaf;
