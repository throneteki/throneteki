import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class WilySmuggler extends DrawCard {
    // Wily Smuggler (14016)
    // Action: Choose 1 card from your hand and place it on top of your deck. Then, at the end of
    // the phase, draw 1 card. (Limit once per round.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Place card on top of deck',
            target: {
                type: 'select',
                activePromptTitle: 'Select a card',
                cardCondition: (card) =>
                    card.location === 'hand' &&
                    card.controller === this.controller &&
                    GameActions.returnCardToDeck({ card }).allow()
            },
            message: '{player} uses {source} to place a card on top of their deck',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.returnCardToDeck((context) => ({
                        card: context.target
                    })),
                    context
                );

                this.game.once('onAtEndOfPhase', () => {
                    if (!context.player.canDraw()) {
                        return;
                    }

                    this.game.addMessage('Then {0} draws 1 card for {1}', context.player, this);
                    context.player.drawCardsToHand(1);
                });
            },
            limit: ability.limit.perRound(1)
        });
    }
}

WilySmuggler.code = '14016';

export default WilySmuggler;
