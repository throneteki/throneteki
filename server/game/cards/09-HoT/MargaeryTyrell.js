import DrawCard from '../../drawcard.js';

class MargaeryTyrell extends DrawCard {
    // Margaery Tyrell (09006)
    // While Margaery Tyrell is attacking, she gets +1 STR for each defending character.
    // Reaction: After Margaery Tyrell is declared as an attacker, choose and kneel a character
    // controlled by the defending player. That character is participating in the challenge as a
    // defender.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isAttacking(),
            match: this,
            effect: ability.effects.dynamicStrength(() => this.getDefendingCharacters())
        });

        this.reaction({
            when: {
                onDeclaredAsAttacker: (event) => event.card === this
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === this.game.currentChallenge.defendingPlayer
            },
            handler: (context) => {
                context.target.controller.kneelCard(context.target);
                this.game.currentChallenge.addDefender(context.target);

                this.game.addMessage(
                    '{0} uses {1} to kneel {2} and have them participate in the current challenge as a defender',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }

    getDefendingCharacters() {
        if (!this.game.isDuringChallenge()) {
            return 0;
        }

        return this.game.currentChallenge.defenders.length;
    }
}

MargaeryTyrell.code = '09006';

export default MargaeryTyrell;
