import DrawCard from '../../drawcard.js';

class Rattleshirt extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.isDuringChallenge({ attackingAlone: this }),
            match: (card) => card.getType() === 'character' && card.attachments.length === 0,
            targetController: 'opponent',
            effect: ability.effects.cannotBeDeclaredAsDefender()
        });
    }
}

Rattleshirt.code = '07039';

export default Rattleshirt;
