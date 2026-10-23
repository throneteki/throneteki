import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';
import GameActions from '../../GameActions/index.js';

class HaldonHalfmaester extends DrawCard {
    // Haldon Halfmaester (18014)
    // Reaction: After you win a challenge in which Haldon Halfmaester is participating, reveal the
    // top card of your deck:
    // - Place 1 gold from the treasury on a card with the same cardtype.
    // - If it is an event, draw it.
    // - If it is Aegon Targaryen, put him into play.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    context.source.isParticipating() &&
                    event.challenge.isMatch({ winner: context.player })
            },
            message: '{player} uses {source} to reveal the top card of their deck',
            gameAction: GameActions.revealTopCards((context) => ({
                player: context.player
            })).then({
                condition: (context) => context.parentContext.revealed.length > 0,
                gameAction: GameActions.simultaneously([
                    GameActions.ifCondition({
                        condition: (context) => revealedCard(context).getType() === 'event',
                        thenAction: {
                            message: 'Then {player} draws the revealed event',
                            gameAction: GameActions.drawSpecific((context) => ({
                                player: context.player,
                                cards: [revealedCard(context)]
                            }))
                        }
                    }),
                    GameActions.ifCondition({
                        condition: (context) => revealedCard(context).name === 'Aegon Targaryen',
                        thenAction: {
                            message: 'Then {player} puts Aegon Targaryen into play',
                            gameAction: GameActions.putIntoPlay((context) => ({
                                card: revealedCard(context)
                            }))
                        }
                    }),
                    GameActions.ifCondition({
                        condition: (context) =>
                            ['character', 'location', 'attachment'].includes(
                                revealedCard(context).getType()
                            ),
                        thenAction: {
                            message: 'Then {player} places 1 gold on a card with the same cardtype',
                            gameAction: GameActions.chooseCards({
                                title: 'Select card to gain 1 gold',
                                cardCondition: (card, context) =>
                                    card.location === 'play area' &&
                                    card.getType() === revealedCard(context).getType(),
                                gameAction: (card) =>
                                    GameActions.placeToken({ card, token: Tokens.gold, amount: 1 })
                            })
                        }
                    })
                ])
            })
        });
    }
}

function revealedCard(context) {
    return context.parentContext.revealed[0];
}

HaldonHalfmaester.code = '18014';

export default HaldonHalfmaester;
