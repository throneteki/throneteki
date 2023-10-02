const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class TheSeedIsStrong extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onInitiativeDetermined: event => event.winner !== this.controller
            },
            message: {
                format: '{player} uses {source} to have {winner} discard a Lord or Lady from their hand or shadows area, or reveal their hand and shadows area',
                args: { winner: context => context.event.winner }
            },
            gameAction: GameActions.ifCondition({
                condition: context => context.event.winner.hand.some(card => card.isMatch({ trait: ['Lord', 'Lady'] }))
                    || context.event.winner.shadows.some(card => card.isMatch({ trait: ['Lord', 'Lady'] })),
                thenAction: GameActions.genericHandler(context => {
                    this.game.promptForSelect(context.event.winner, {
                        source: this,
                        cardCondition: { location: ['hand', 'shadows'], trait: ['Lord', 'Lady'], controller: context.event.winner },
                        onSelect: (player, card) => this.onCardSelected(context, card),
                        onCancel: () => this.onCancel(context)
                    });
                }),
                elseAction: {
                    message: '{player} {gameAction}, containing no Lord or Lady characters',
                    gameAction: GameActions.revealCards(context => ({
                        cards: [...context.event.winner.hand, ...context.event.winner.shadows],
                        revealWithMessage: false
                    }))
                }
            })
        });
    }

    onCardSelected(context, card) {
        this.game.addMessage('{0} discards {1} from their {2}', context.event.winner, card, card.location);
        this.game.resolveGameAction(
            GameActions.discardCard({ card }),
            context
        );
        return true;
    }

    onCancel(context) {
        this.game.addAlert('danger', '{0} did not select a card to discard', context.event.winner);

        return true;
    }
}

TheSeedIsStrong.code = '23037';

module.exports = TheSeedIsStrong;
