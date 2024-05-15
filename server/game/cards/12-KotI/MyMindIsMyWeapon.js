import DrawCard from '../../drawcard.js';

class MyMindIsMyWeapon extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Add to challenge',
            condition: () => this.game.isDuringChallenge({ challengeType: 'military' }),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller === this.controller &&
                    card.getType() === 'character' &&
                    card.hasIcon('intrigue') &&
                    !card.isParticipating()
            },
            message: '{player} plays {source} to add {target} to the challenge',
            handler: (context) => {
                this.game.currentChallenge.addParticipantToSide(context.player, context.target);
            }
        });
    }
}

MyMindIsMyWeapon.code = '12028';

export default MyMindIsMyWeapon;
