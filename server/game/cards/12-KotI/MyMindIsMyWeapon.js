import DrawCard from '../../drawcard.js';

class MyMindIsMyWeapon extends DrawCard {
    // My Mind Is My Weapon (12028)
    // Action: During a [military] challenge, choose a character you control with an [intrigue] icon
    // and have it participate in the challenge on your side.
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
