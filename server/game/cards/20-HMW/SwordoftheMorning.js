import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

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
            condition: (context) => context.source.parent.isAttacking(),
            effect: ability.effects.dynamicStrength((card, context) =>
                context.source.getDefendingCharacters()
            )
        });

        this.reaction({
            when: {
                onDeclaredAsAttacker: (event, context) => event.card === context.source.parent
            },
            target: {
                mode: 'upTo',
                numCards: 3,
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === context.game.currentChallenge.defendingPlayer
            },
            message:
                '{player} uses {source} to force {target} to be declared as a defender this challenge, if able',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: context.target,
                targetController: 'any',
                effect: ability.effects.mustBeDeclaredAsDefender()
            }))
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
