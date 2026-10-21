import DrawCard from '../../drawcard.js';

class TheKnight extends DrawCard {
    // The Knight (12004)
    // No attachments except Weapon.
    // While The Knight is attacking alone, he gains stealth and renown.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.game.isDuringChallenge({
                    attackingPlayer: context.source.controller,
                    attackingAlone: context.source
                }),
            match: this,
            effect: [ability.effects.addKeyword('renown'), ability.effects.addKeyword('stealth')]
        });
    }
}

TheKnight.code = '12004';

export default TheKnight;
