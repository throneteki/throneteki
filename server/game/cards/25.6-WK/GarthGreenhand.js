import DrawCard from '../../drawcard.js';

class GarthGreenhand extends DrawCard {
    // Garth Greenhand (25116)
    // Unique [tyrell] location you control only.
    // During a challenge, each unique participating [tyrell] character you control gets +1 STR.
    // +1 Income.
    setupCardAbilities(ability) {
        this.attachmentRestriction({
            type: 'location',
            faction: 'tyrell',
            controller: 'current',
            unique: true
        });
        this.plotModifiers({
            gold: 1
        });
        this.persistentEffect({
            condition: () => this.game.isDuringChallenge(),
            match: (card) =>
                card.controller === this.controller &&
                card.isUnique() &&
                card.isParticipating() &&
                card.isFaction('tyrell'),
            effect: ability.effects.modifyStrength(1)
        });
    }
}

GarthGreenhand.code = '25116';

export default GarthGreenhand;
