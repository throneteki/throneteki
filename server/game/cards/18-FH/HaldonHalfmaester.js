import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';
import GameActions from '../../GameActions/index.js';

class HaldonHalfmaester extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    this.isParticipating() && event.challenge.isMatch({ winner: this.controller })
            },
            message: '{player} uses {source} to reveal the top card of their deck',
            gameAction: GameActions.revealTopCards((context) => ({
                player: context.player
            })).then({
                condition: (context) => context.event.revealed.length > 0,
                handler: (context) => {
                    let topCard = context.event.revealed[0];
                    //place 1 gold on card of the same type
                    if (
                        ['character', 'location', 'attachment'].includes(topCard.getType()) &&
                        this.game.anyCardsInPlay((card) => card.getType() === topCard.getType())
                    ) {
                        this.game.promptForSelect(context.player, {
                            activePromptTitle: 'Select card to gain 1 gold',
                            cardCondition: (card) =>
                                card.getType() === topCard.getType() &&
                                card.location === 'play area',
                            source: this,
                            onSelect: (player, card) => {
                                this.continueHandler(card, context);
                                return true;
                            }
                        });
                    } else {
                        this.continueHandler(null, context);
                    }
                }
            })
        });
    }

    continueHandler(goldCard, context) {
        const gameAction = GameActions.simultaneously([
            GameActions.ifCondition({
                condition: (context) =>
                    context.event.revealed.some((card) => card.isMatch({ type: 'event' })),
                thenAction: GameActions.drawSpecific((context) => ({
                    player: context.player,
                    cards: context.event.revealed
                }))
            }),
            GameActions.ifCondition({
                condition: (context) =>
                    context.event.revealed.some((card) =>
                        card.isMatch({ name: 'Aegon Targaryen' })
                    ),
                thenAction: GameActions.putIntoPlay((context) => ({
                    card: context.event.revealed.filter((card) =>
                        card.isMatch({ name: 'Aegon Targaryen' })
                    )[0]
                }))
            }),
            GameActions.ifCondition({
                condition: () => !!goldCard,
                thenAction: GameActions.placeToken(() => ({
                    card: goldCard,
                    token: Tokens.gold,
                    amount: 1
                }))
            })
        ]);

        if (gameAction.allow(context)) {
            this.game.addMessage('{0} {1}', context.player, gameAction.message(context));
            this.game.resolveGameAction(gameAction, context);
        }
    }
}

HaldonHalfmaester.code = '18014';

export default HaldonHalfmaester;
