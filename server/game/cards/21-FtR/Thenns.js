import DrawCard from '../../drawcard.js';

class Thenns extends DrawCard {
    // Thenns (21026)
    // Assault. Pillage. No attachments except Weapon.
    // Thenns cannot target a location using assault unless each character you declare as an
    // attacker has the Army or Wildling trait.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.anyNonArmyOrWildlingInPlay() && this.game.isDuringChallenge(),
            match: this,
            effect: ability.effects.cannotTargetUsingAssault()
        });
    }

    anyNonArmyOrWildlingInPlay() {
        return this.game.anyCardsInPlay(
            (card) => card.isAttacking() && !card.hasTrait('Army') && !card.hasTrait('Wildling')
        );
    }
}

Thenns.code = '21026';

export default Thenns;
