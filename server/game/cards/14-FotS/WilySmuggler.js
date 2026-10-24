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
                cardCondition: (card, context) =>
                    card.location === 'hand' && card.controller === context.player,
                gameAction: 'returnCardToDeck'
            },
            message: '{player} uses {source} to place a card on top of their deck',
            gameAction: GameActions.returnCardToDeck((context) => ({ card: context.target })).then({
                gameAction: GameActions.delayedEffect({
                    duration: 'untilEndOfRound',
                    when: {
                        onAtEndOfPhase: () => true
                    },
                    message: 'Then {player} draws 1 card for {source}',
                    gameAction: GameActions.drawCards((context) => ({
                        player: context.player,
                        amount: 1
                    }))
                })
            }),
            limit: ability.limit.perRound(1)
        });
    }
}

WilySmuggler.code = '14016';

export default WilySmuggler;
