import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class Gendry extends DrawCard {
    // Gendry (22001)
    // While you control no loyal characters, Gendry gains renown.
    // Reaction: After the challenges phase begins, choose a non-loyal character with a Weapon
    // attachment. Until the end of the phase, that character gets +2 STR and gains each of Gendry's
    // keywords.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                !context.source.controller.anyCardsInPlay(
                    (card) => card.getType() === 'character' && card.isLoyal()
                ),
            match: this,
            effect: ability.effects.addKeyword('Renown')
        });
        this.reaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'challenge'
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    !card.isLoyal() &&
                    card.attachments.some((attachment) => attachment.hasTrait('Weapon'))
            },
            message: {
                format: "{player} uses {source} to have {target} gain +2 STR and each of {source}'s keywords: {keywords}",
                args: { keywords: (context) => context.source.getKeywords() }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: [
                    ability.effects.modifyStrength(2),
                    ...context.source
                        .getKeywords()
                        .map((keyword) => ability.effects.addKeyword(keyword))
                ]
            }))
        });
    }
}

Gendry.code = '22001';

export default Gendry;
