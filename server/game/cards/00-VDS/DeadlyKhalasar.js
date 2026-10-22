import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DeadlyKhalasar extends DrawCard {
    // Deadly Khalasar (00015)
    // Challenges Action: Choose an attacking [targaryen] character you control. Until the end of
    // the challenge, that character gets +1 STR for each Dothraki character you control and gains
    // intimidate.
    // Draft format only.
    setupCardAbilities(ability) {
        this.action({
            title: 'Give character +STR and intimidate',
            condition: (context) => context.game.isDuringChallenge(),
            phase: 'challenge',
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.source.controller &&
                    card.getType() === 'character' &&
                    card.isFaction('targaryen') &&
                    card.isAttacking()
            },
            message: {
                format: '{player} plays {source} to give {target} +{strBoost} STR and intimidate until the end of the challenge',
                args: { strBoost: (context) => context.source.getNumberOfDothraki() }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: context.target,
                effect: [
                    ability.effects.modifyStrength(context.source.getNumberOfDothraki()),
                    ability.effects.addKeyword('intimidate')
                ]
            }))
        });
    }

    getNumberOfDothraki() {
        return this.controller.getNumberOfCardsInPlay(
            (card) => card.getType() === 'character' && card.hasTrait('dothraki')
        );
    }
}

DeadlyKhalasar.code = '00015';

export default DeadlyKhalasar;
