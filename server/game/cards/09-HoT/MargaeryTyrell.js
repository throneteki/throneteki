import DrawCard from '../../drawcard.js';

class MargaeryTyrell extends DrawCard {
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
