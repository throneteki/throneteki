import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class SerJaimeLannister extends DrawCard {
    // Ser Jaime Lannister (05005)
    // Each Knight character you control gains renown while attacking alone.
    // Challenges Action: Choose a Kingsguard character. Until the end of the phase, that character
    // gains an [intrigue] icon. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.game.currentChallenge &&
                context.game.currentChallenge.attackers.length === 1,
            match: (card) => card.hasTrait('Knight') && card.isAttacking(),
            effect: ability.effects.addKeyword('Renown')
        });

        this.action({
            title: 'Give an intrigue icon to a character',
            limit: ability.limit.perPhase(1),
            phase: 'challenge',
            target: {
                activePromptTitle: 'Select character',
                cardCondition: (card, context) => context.source.isKingsguardCharacter(card)
            },
            message: '{player} uses {source} to give {target} an intrigue icon',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.addIcon('intrigue')
            }))
        });
    }

    isKingsguardCharacter(card) {
        return (
            card.location === 'play area' &&
            card.hasTrait('Kingsguard') &&
            card.getType() === 'character'
        );
    }
}

SerJaimeLannister.code = '05005';

export default SerJaimeLannister;
