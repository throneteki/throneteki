const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class MyrishLens extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: () => this.game.getPlayers().every(player => player.shadows.length === 0),
            effect: ability.effects.addKeyword('insight')
        });
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && this.parent.isParticipating()
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to choose and reveal a card in {loser}\'s shadows area',
                args: { loser: context => context.event.challenge.loser }
            },
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card, context) => card.location === 'shadows' && card.controller === context.event.challenge.loser
            },
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.revealCards(context => ({
                        cards: [context.target],
                        player: context.player
                    })).then({
                        condition: context => context.parentContext.revealed[0].getType() === 'event',
                        message: {
                            format: 'Then, {player} discards {card} from shadows',
                            args: { card: context => context.parentContext.revealed[0] }
                        },
                        gameAction: GameActions.discardCard(context => ({ card: context.parentContext.revealed[0] }))
                    })
                    , context);
            }
        });
    }
}

MyrishLens.code = '24006';

module.exports = MyrishLens;
