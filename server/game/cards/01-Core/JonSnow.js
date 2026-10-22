import DrawCard from '../../drawcard.js';

class JonSnow extends DrawCard {
    // Jon Snow (01124)
    // No attachments except Weapon.
    // While Jon Snow is standing, he is considered to be participating in each challenge in which
    // you control another attacking [thenightswatch] character.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                !context.source.kneeled && context.source.hasOtherAttackingNightsWatch(),
            match: this,
            effect: ability.effects.consideredToBeAttacking()
        });
    }

    hasOtherAttackingNightsWatch() {
        return this.controller.anyCardsInPlay(
            (card) =>
                card.isAttacking() &&
                card.isFaction('thenightswatch') &&
                card.getType() === 'character' &&
                card !== this
        );
    }
}

JonSnow.code = '01124';

export default JonSnow;
