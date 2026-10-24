import DrawCard from '../../drawcard.js';

function hasOtherAttackingNightsWatch(source) {
    return source.controller.anyCardsInPlay(
        (card) =>
            card.isAttacking() &&
            card.isFaction('thenightswatch') &&
            card.getType() === 'character' &&
            card !== source
    );
}

class JonSnow extends DrawCard {
    // Jon Snow (01124)
    // No attachments except Weapon.
    // While Jon Snow is standing, he is considered to be participating in each challenge in which
    // you control another attacking [thenightswatch] character.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                !context.source.kneeled && hasOtherAttackingNightsWatch(context.source),
            match: this,
            effect: ability.effects.consideredToBeAttacking()
        });
    }
}

JonSnow.code = '01124';

export default JonSnow;
