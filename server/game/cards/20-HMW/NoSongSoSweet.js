import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class NoSongSoSweet extends DrawCard {
    // No Song So Sweet (20004)
    // Action: During a [power] challenge, choose a standing [baratheon] character you control and
    // have it participate in the challenge on your side.
    // Reaction: After you play a Song event, pay 1 gold to return No Song So Sweet from your
    // discard pile to your hand.
    setupCardAbilities(ability) {
        this.action({
            title: 'Add to challenge',
            condition: (context) => context.game.isDuringChallenge({ challengeType: 'power' }),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    !card.kneeled &&
                    card.controller === context.player &&
                    card.isFaction('baratheon') &&
                    card.canParticipateInChallenge()
            },
            message: '{player} plays {source} to add {target} to the challenge',
            gameAction: GameActions.addToChallenge((context) => ({
                card: context.target,
                player: context.player
            }))
        });

        this.reaction({
            location: 'discard pile',
            when: {
                onCardPlayed: (event, context) =>
                    event.card.hasTrait('Song') &&
                    event.card.controller === context.source.controller
            },
            ignoreEventCosts: true,
            cost: ability.costs.payGold(1),
            message: '{player} uses {source} to return {source} to their hand',
            gameAction: GameActions.returnCardToHand({ card: this })
        });
    }
}

NoSongSoSweet.code = '20004';

export default NoSongSoSweet;
