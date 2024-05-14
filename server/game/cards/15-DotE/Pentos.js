const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class Pentos extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDrawn: (event) =>
                    event.player === this.controller &&
                    event.card.getType() === 'attachment' &&
                    this.controller.canPutIntoPlay(event.card)
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to reveal {drawnCard} and put it into play',
                args: { drawnCard: (context) => context.event.card }
            },
            gameAction: GameActions.revealCards((context) => ({
                player: context.player,
                cards: [context.event.card]
            })).then({
                condition: (context) => context.event.revealed.length > 0,
                gameAction: GameActions.putIntoPlay((context) => ({
                    card: context.event.revealed[0]
                })).then({
                    message: 'Then, {player} draws 1 card',
                    gameAction: GameActions.drawCards((context) => ({
                        player: context.player,
                        amount: 1
                    }))
                })
            })
        });
    }
}

Pentos.code = '15018';

module.exports = Pentos;
