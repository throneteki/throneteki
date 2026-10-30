import DrawCard from '../../drawcard.js';

class Rattleshirt extends DrawCard {
    // Rattleshirt (07039)
    // While Rattleshirt is attacking alone, each character without attachments cannot be declared
    // as a defender.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.game.isDuringChallenge({ attackingAlone: context.source }),
            match: (card) => card.getType() === 'character' && card.attachments.length === 0,
            targetController: 'opponent',
            effect: ability.effects.cannotBeDeclaredAsDefender()
        });
    }
}

Rattleshirt.code = '07039';

export default Rattleshirt;
