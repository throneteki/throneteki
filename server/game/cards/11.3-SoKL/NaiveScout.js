import DrawCard from '../../drawcard.js';

class NaiveScout extends DrawCard {
    // Naive Scout (11045)
    // No attachments except Weapon.
    // While there is a card in shadows, Naive Scout cannot be declared as a defender.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.getPlayers().some((player) => player.shadows.length > 0),
            match: this,
            effect: ability.effects.cannotBeDeclaredAsDefender()
        });
    }
}

NaiveScout.code = '11045';

export default NaiveScout;
