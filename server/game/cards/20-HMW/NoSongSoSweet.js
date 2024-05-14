import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class NoSongSoSweet extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Add to challenge',
            condition: () => this.game.isDuringChallenge({ challengeType: 'power' }),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    !card.kneeled &&
                    card.controller === context.player &&
                    card.isFaction('baratheon') &&
                    card.canParticipateInChallenge()
            },
            message: '{player} plays {source} to add {target} to the challenge',
            handler: (context) => {
                this.game.currentChallenge.addParticipantToSide(context.player, context.target);
            }
        });

        this.reaction({
            location: 'discard pile',
            when: {
                onCardPlayed: (event) =>
                    event.card.hasTrait('Song') && event.card.controller === this.controller
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
