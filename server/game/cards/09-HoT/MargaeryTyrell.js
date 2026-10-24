import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MargaeryTyrell extends DrawCard {
    // Margaery Tyrell (09006)
    // While Margaery Tyrell is attacking, she gets +1 STR for each defending character.
    // Reaction: After Margaery Tyrell is declared as an attacker, choose and kneel a character
    // controlled by the defending player. That character is participating in the challenge as a
    // defender.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.isAttacking(),
            match: (card, context) => card === context.source,
            effect: ability.effects.dynamicStrength((card) =>
                card.game.isDuringChallenge() ? card.game.currentChallenge.defenders.length : 0
            )
        });

        this.reaction({
            when: {
                onDeclaredAsAttacker: (event, context) => event.card === context.source
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === context.game.currentChallenge.defendingPlayer
            },
            message:
                '{player} uses {source} to kneel {target} and have them participate in the current challenge as a defender',
            gameAction: GameActions.simultaneously([
                GameActions.kneelCard((context) => ({ card: context.target })),
                GameActions.addToChallenge((context) => ({ card: context.target }))
            ])
        });
    }
}

MargaeryTyrell.code = '09006';

export default MargaeryTyrell;
