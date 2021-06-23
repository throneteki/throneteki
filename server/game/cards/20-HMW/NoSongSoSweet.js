const DrawCard = require('../../drawcard.js');

class NoSongSoSweet extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Add to challenge',
            condition: () => this.game.isDuringChallenge({ challengeType: 'power' }),
            target: {
                cardCondition: card => card.location === 'play area' && !card.kneeled && card.controller === this.controller &&
                                       card.isFaction('baratheon') && card.canParticipateInChallenge()
            },
            message: '{player} plays {source} to add {target} to the challenge',
            handler: context => {
                this.game.currentChallenge.addParticipantToSide(context.player, context.target);
            }
        });
        
        this.reaction({
            location: 'discard pile',
            when: {
                onCardPlayed: event => event.card.hasTrait('Song') && event.card.controller === this.controller
            },
            ignoreEventCosts: true,
            cost: ability.costs.payGold(1),
            handler: () => {
                this.game.addMessage('{0} returns {1} back to their hand', this.controller, this);
                this.controller.moveCard(this, 'hand');
            }
        });
    }
}

NoSongSoSweet.code = '20004';

module.exports = NoSongSoSweet;
