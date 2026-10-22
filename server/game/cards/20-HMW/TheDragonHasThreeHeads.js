import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheDragonHasThreeHeads extends DrawCard {
    // The Dragon Has Three Heads (20034)
    // Action: Until the end of the phase, each Dragon character you control gains:
    // - intimidate, if you control Drogon.
    // - renown, if you control Rhaegal.
    // - stealth, if you control Viserion.
    setupCardAbilities(ability) {
        this.action({
            message: {
                format: '{player} plays {source} to have each Dragon character they control gain {keywords} until the end of the phase',
                args: { keywords: (context) => dragonKeywords(context) }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: (card) =>
                    card.hasTrait('Dragon') &&
                    card.getType() === 'character' &&
                    card.controller === context.player,
                effect: dragonKeywords(context).map((keyword) =>
                    ability.effects.addKeyword(keyword)
                )
            }))
        });
    }
}

const DragonKeywords = { Drogon: 'intimidate', Rhaegal: 'renown', Viserion: 'stealth' };

function dragonKeywords(context) {
    return Object.entries(DragonKeywords)
        .filter(([name]) => context.player.anyCardsInPlay((card) => card.name === name))
        .map(([, keyword]) => keyword);
}

TheDragonHasThreeHeads.code = '20034';

export default TheDragonHasThreeHeads;
