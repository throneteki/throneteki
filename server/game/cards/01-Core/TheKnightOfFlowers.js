import DrawCard from '../../drawcard.js';

class TheKnightOfFlowers extends DrawCard {
    // The Knight of Flowers (01185)
    // Renown.
    // While The Knight of Flowers is attacking alone, the defending player cannot declare more than
    // 1 character as a defender.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.isDuringChallenge({ attackingAlone: this }),
            targetController: 'opponent',
            effect: ability.effects.setDefenderMaximum(1)
        });
    }
}

TheKnightOfFlowers.code = '01185';

export default TheKnightOfFlowers;
