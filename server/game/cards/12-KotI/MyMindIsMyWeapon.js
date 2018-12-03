const DrawCard = require('../../drawcard');

class MyMindIsMyWeapon extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Add to challenge',
            condition: () => this.game.isDuringChallenge({ challengeType: 'military' }),
            target: {
                cardCondition: card => card.location === 'play area' && card.controller === this.controller && card.getType() === 'character' && card.hasIcon('intrigue') && !card.isParticipating()
            },
            handler: context => {
                this.game.addMessage('{0} plays {1} to add {2} to the challenge', context.player, this, context.target);
                this.game.currentChallenge.addParticipantToSide(context.player, context.target);
            }
        });
    }
}

MyMindIsMyWeapon.code = '12028';

module.exports = MyMindIsMyWeapon;
