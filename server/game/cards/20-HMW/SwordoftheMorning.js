import DrawCard from '../../drawcard.js';

class SwordoftheMorning extends DrawCard {
    // Sword of the Morning (20018)
    // Unique [martell] character or House Dayne character only.
    // While attached character is attacking, it gets +1 STR for each defending character.
    // Reaction: After attached character is declared as an attacker, choose up to 3 characters
    // controlled by the defending player. Each of those characters must be declared as a defender
    // for this challenge, if able.
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
