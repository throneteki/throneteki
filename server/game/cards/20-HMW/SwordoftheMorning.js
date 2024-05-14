import DrawCard from '../../drawcard.js';

class SwordoftheMorning extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'martell', unique: true }, { trait: 'House Dayne' });
        this.whileAttached({
            condition: () => this.parent.isAttacking(),
            effect: ability.effects.dynamicStrength(() => this.getDefendingCharacters())
        });

        this.reaction({
            when: {
                onDeclaredAsAttacker: (event) => event.card === this.parent
            },
            target: {
                mode: 'upTo',
                numCards: 3,
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === this.game.currentChallenge.defendingPlayer
            },
            message:
                '{player} uses {source} to force {target} to be declared as a defender this challenge, if able',
            handler: (context) => {
                this.untilEndOfChallenge((ability) => ({
                    match: context.target,
                    targetController: 'any',
                    effect: ability.effects.mustBeDeclaredAsDefender()
                }));
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

SwordoftheMorning.code = '20018';

export default SwordoftheMorning;
