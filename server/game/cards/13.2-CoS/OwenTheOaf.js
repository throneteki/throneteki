import DrawCard from '../../drawcard.js';

class OwenTheOaf extends DrawCard {
    // Owen the Oaf (13025)
    // No attachments except Weapon.
    // While Owen the Oaf is participating in a challenge, each character with more than 1 challenge
    // icon does not contribute its STR to the challenge.
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
