import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MyMindIsMyWeapon extends DrawCard {
    // My Mind Is My Weapon (12028)
    // Action: During a [military] challenge, choose a character you control with an [intrigue] icon
    // and have it participate in the challenge on your side.
    setupCardAbilities() {
        this.action({
            title: 'Add to challenge',
            condition: (context) => context.game.isDuringChallenge({ challengeType: 'military' }),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.source.controller &&
                    card.getType() === 'character' &&
                    card.hasIcon('intrigue') &&
                    !card.isParticipating()
            },
            message: '{player} plays {source} to add {target} to the challenge',
            gameAction: GameActions.addToChallenge((context) => ({
                card: context.target,
                player: context.player
            }))
        });
    }
}

MyMindIsMyWeapon.code = '12028';

export default MyMindIsMyWeapon;
