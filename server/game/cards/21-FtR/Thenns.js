import DrawCard from '../../drawcard.js';

function hasAttackerThatIsNotArmyOrWildling(game) {
    const challenge = game.currentChallenge;
    return (
        !!challenge &&
        challenge.attackers.some((card) => !card.hasTrait('Army') && !card.hasTrait('Wildling'))
    );
}

class Thenns extends DrawCard {
    // Thenns (21026)
    // Assault. Pillage. No attachments except Weapon.
    // Thenns cannot target a location using assault unless each character you declare as an
    // attacker has the Army or Wildling trait.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => hasAttackerThatIsNotArmyOrWildling(context.game),
            match: (card, context) => card === context.source,
            effect: ability.effects.cannotTargetUsingAssault()
        });
    }
}

Thenns.code = '21026';

export default Thenns;
