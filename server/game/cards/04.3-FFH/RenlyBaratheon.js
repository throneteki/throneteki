import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

function anyOpponentControlsKing(source) {
    return source.game.getPlayers().some((player) => {
        if (player === source.controller) {
            return false;
        }

        return player.anyCardsInPlay(
            (card) => card.getType() === 'character' && card.hasTrait('King')
        );
    });
}

class RenlyBaratheon extends DrawCard {
    // Renly Baratheon (04043)
    // Insight. Renown.
    // While an opponent controls a King character, Renly Baratheon cannot be saved.
    // Reaction: After you draw a loyal card using insight, reveal it to draw 1 card.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => anyOpponentControlsKing(context.source),
            match: this,
            effect: ability.effects.cannotBeSaved()
        });

        this.reaction({
            when: {
                onCardsDrawn: (event, context) =>
                    event.reason === 'insight' &&
                    event.source.controller === context.source.controller &&
                    event.cards[0].isLoyal()
            },
            cost: ability.costs.revealSpecific((context) => context.event.cards[0]),
            message:
                '{player} uses {source} and reveals {costs.reveal} from their hand to draw 1 card',
            gameAction: GameActions.drawCards((context) => ({
                player: context.player,
                amount: 1
            }))
        });
    }
}

RenlyBaratheon.code = '04043';

export default RenlyBaratheon;
