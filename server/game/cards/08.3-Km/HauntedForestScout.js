import DrawCard from '../../drawcard.js';

class HauntedForestScout extends DrawCard {
    // Haunted Forest Scout (08045)
    // No attachments except Weapon.
    // Haunted Forest Scout cannot be declared as a defender.
    // While you control 3 or more Ranger characters, Haunted Forest Scout does not kneel when
    // declared as an attacker.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.cannotBeDeclaredAsDefender()
        });
        this.persistentEffect({
            condition: (context) => context.source.getNumberOfRangers() >= 3,
            match: this,
            effect: ability.effects.doesNotKneelAsAttacker()
        });
    }

    getNumberOfRangers() {
        return this.controller.getNumberOfCardsInPlay(
            (card) => card.getType() === 'character' && card.hasTrait('Ranger')
        );
    }
}

HauntedForestScout.code = '08045';

export default HauntedForestScout;
