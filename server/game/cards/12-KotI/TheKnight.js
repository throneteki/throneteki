import DrawCard from '../../drawcard.js';

class TheKnight extends DrawCard {
    // The Knight (12004)
    // No attachments except Weapon.
    // While The Knight is attacking alone, he gains stealth and renown.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.game.isDuringChallenge({
                    attackingPlayer: this.controller,
                    attackingAlone: this
                }),
            match: this,
            effect: [ability.effects.addKeyword('renown'), ability.effects.addKeyword('stealth')]
        });
    }
}

TheKnight.code = '12004';

export default TheKnight;
