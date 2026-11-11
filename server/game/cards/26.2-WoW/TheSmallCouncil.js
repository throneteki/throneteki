import AgendaCard from '../../agendacard.js';
import GameActions from '../../GameActions/index.js';

class TheSmallCouncil extends AgendaCard {
    // The Small Council (26040)
    // You may include non-loyal Small Council characters from any faction in your deck. You must
    // include at least 7 different Small Council characters in your deck.
    // Reaction: After you win dominance, choose a standing Small Council character you control and
    // have it gain 1 power. Then, if you control a King or Queen character, draw 1 card.
    setupCardAbilities() {
        this.reaction({
            when: {
                onDominanceDetermined: (event, context) =>
                    context.source.controller === event.winner
            },
            target: {
                cardCondition: {
                    location: 'play area',
                    type: 'character',
                    trait: 'Small Council',
                    kneeled: false,
                    controller: 'current',
                    condition: (card) => GameActions.gainPower({ card, amount: 1 }).allow()
                }
            },
            message: '{player} uses {source} to have {target} gain 1 power',
            gameAction: GameActions.gainPower((context) => ({
                card: context.target,
                amount: 1
            })).then({
                condition: (context) =>
                    context.player.anyCardsInPlay({
                        type: 'character',
                        trait: ['King', 'Queen']
                    }),
                message: 'Then, {player} draws 1 card',
                gameAction: GameActions.drawCards((context) => ({
                    player: context.player,
                    amount: 1
                }))
            })
        });
    }
}

TheSmallCouncil.code = '26040';

export default TheSmallCouncil;
