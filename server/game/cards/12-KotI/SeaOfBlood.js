import AgendaCard from '../../agendacard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class SeaOfBlood extends AgendaCard {
    // Sea of Blood (12045)
    // During [military] challenges, reduce the cost of each event you play by 1 for each blood
    // token on Sea of Blood. You cannot play events during [intrigue] or [power] challenges.
    // Reaction: After you win a [military] challenge by 5 or more STR, kneel your faction card to
    // place a blood token on Sea of Blood. Then, search your deck for an event, reveal it, and add
    // it to your hand. Shuffle your deck.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.game.isDuringChallenge({ challengeType: 'military' }),
            effect: ability.effects.reduceCost({
                playingTypes: 'play',
                amount: (card, source) => source.tokens[Tokens.blood],
                match: (card) => card.getType() === 'event'
            })
        });
        this.persistentEffect({
            condition: (context) =>
                context.game.isDuringChallenge({ challengeType: ['intrigue', 'power'] }),
            effect: ability.effects.cannotPlay((card) => card.getType() === 'event')
        });
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.challengeType === 'military' &&
                    event.challenge.winner === context.player &&
                    event.challenge.strengthDifference >= 5
            },
            cost: ability.costs.kneelFactionCard(),
            message:
                '{player} uses {source} and kneels their faction card to place 1 blood token on {source}',
            gameAction: GameActions.placeToken((context) => ({
                card: context.source,
                token: Tokens.blood
            })).then({
                message: 'Then, {player} searches their deck for an event',
                gameAction: GameActions.search({
                    title: 'Select an event',
                    match: { type: 'event' },
                    message: '{player} {gameAction}',
                    gameAction: GameActions.addToHand((context) => ({
                        card: context.searchTarget
                    }))
                })
            })
        });
    }
}

SeaOfBlood.code = '12045';

export default SeaOfBlood;
