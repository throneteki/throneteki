import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerClaytonSuggs extends DrawCard {
    // Ser Clayton Suggs (26001)
    // Reaction: After power is gained by or moved to a character, that character gets +1 STR or -1
    // STR until the end of the phase. (Limit 3 times per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPowerGained: (event) => event.card.getType() === 'character',
                onCardPowerMoved: (event) => event.target.getType() === 'character'
            },
            limit: ability.limit.perPhase(3),
            choices: {
                'Give +1 STR': {
                    message: {
                        format: '{player} uses {source} to give {character} +1 STR until the end of the phase',
                        args: { character: (context) => context.event.target || context.event.card }
                    },
                    gameAction: GameActions.lastingEffect((context) => ({
                        duration: 'untilEndOfPhase',
                        match: context.event.target || context.event.card,
                        effect: ability.effects.modifyStrength(1)
                    }))
                },
                'Give -1 STR': {
                    message: {
                        format: '{player} uses {source} to give {character} -1 STR until the end of the phase',
                        args: { character: (context) => context.event.target || context.event.card }
                    },
                    gameAction: GameActions.lastingEffect((context) => ({
                        duration: 'untilEndOfPhase',
                        match: context.event.target || context.event.card,
                        effect: ability.effects.modifyStrength(-1)
                    }))
                }
            }
        });
    }
}

SerClaytonSuggs.code = '26001';

export default SerClaytonSuggs;
