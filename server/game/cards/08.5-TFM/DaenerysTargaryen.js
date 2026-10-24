import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class DaenerysTargaryen extends DrawCard {
    // Daenerys Targaryen (08093)
    // Daenerys Targaryen's STR cannot be reduced by card effects.
    // Reaction: After you play a [targaryen] event, choose a character. Until the end of the phase,
    // that character gets -1 STR and is killed if its STR is 0. (Limit 3 times per round.)
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.cannotDecreaseStrength(
                (context) => context.resolutionStage === 'effect'
            )
        });
        this.reaction({
            when: {
                onCardPlayed: (event, context) =>
                    event.card.controller === context.source.controller &&
                    event.card.isFaction('targaryen')
            },
            limit: ability.limit.perRound(3),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            message: '{player} uses {source} to give {target} -1 STR until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.killByStrength(-1)
            }))
        });
    }
}

DaenerysTargaryen.code = '08093';

export default DaenerysTargaryen;
