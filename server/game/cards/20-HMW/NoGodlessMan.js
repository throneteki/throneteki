import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';
import GameActions from '../../GameActions/index.js';

class NoGodlessMan extends DrawCard {
    // No Godless Man (20010)
    // Reaction: After you win a [power] challenge in which you control a participating Drowned God
    // character, for every 5 STR by which you won the challenge, draw 1 card and discard 1 card at
    // random from the losing opponent’s hand. (Max 1 per challenge.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    event.challenge.challengeType === 'power' &&
                    event.challenge.strengthDifference >= 5 &&
                    context.player.anyCardsInPlay(
                        (card) =>
                            card.isParticipating() &&
                            card.hasTrait('Drowned God') &&
                            card.getType() === 'character'
                    )
            },
            max: ability.limit.perChallenge(1),
            message: {
                format: '{player} plays {source} to draw {cards}',
                args: { cards: (context) => TextHelper.count(godlessCount(context), 'card') }
            },
            gameAction: GameActions.simultaneously((context) => [
                GameActions.discardAtRandom({
                    player: context.event.challenge.loser,
                    amount: godlessCount(context)
                }),
                GameActions.drawCards({ player: context.player, amount: godlessCount(context) })
            ])
        });
    }
}

function godlessCount(context) {
    return Math.trunc(context.event.challenge.strengthDifference / 5);
}

NoGodlessMan.code = '20010';

export default NoGodlessMan;
