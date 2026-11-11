import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TrisBotley extends DrawCard {
    // Tris Botley (08031)
    // Pillage.
    // Action: Choose a card in an opponent's discard pile and remove it from the game. Until Tris
    // Botley leaves play, that player cannot marshal or play any copy of that card. (Limit once per
    // round.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove card from game',
            limit: ability.limit.perRound(1),
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card, context) =>
                    card.location === 'discard pile' && card.controller !== context.player
            },
            message: {
                format: '{player} uses {source} to remove {target} from the game, and {owner} cannot marshal or play any copy of it until {source} leaves play',
                args: { owner: (context) => context.target.owner }
            },
            gameAction: GameActions.simultaneously([
                GameActions.removeFromGame((context) => ({ card: context.target })),
                GameActions.lastingEffect((context) => ({
                    duration: 'custom',
                    until: {
                        onCardLeftPlay: (event) => event.card === context.source
                    },
                    targetController: context.target.owner,
                    effect: [
                        ability.effects.cannotMarshal((card) => card.isCopyOf(context.target)),
                        ability.effects.cannotPlay((card) => card.isCopyOf(context.target))
                    ]
                }))
            ])
        });
    }
}

TrisBotley.code = '08031';

export default TrisBotley;
