const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class RenlyBaratheon extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.anyOpponentControlsKing(),
            match: this,
            effect: ability.effects.cannotBeSaved()
        });

        this.reaction({
            when: {
                onCardsDrawn: event =>
                    event.reason === 'insight' &&
                    event.source.controller === this.controller &&
                    event.cards[0].isLoyal()
            },
            cost: ability.costs.revealSpecific(context => context.event.cards[0]),
            message: '{player} uses {source} and reveals {costs.reveal} from their hand to draw 1 card',
            gameAction: GameActions.drawCards(context => ({
                player: context.player,
                amount: 1
            }))
        });
    }

    anyOpponentControlsKing() {
        return this.game.getPlayers().some(player => {
            if(player === this.controller) {
                return false;
            }

            return player.anyCardsInPlay(card => card.getType() === 'character' && card.hasTrait('King'));
        });
    }
}

RenlyBaratheon.code = '04043';

module.exports = RenlyBaratheon;
