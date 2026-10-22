import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AtNightTheyHowl extends DrawCard {
    // At Night They Howl (08003)
    // Challenges Action: Choose and stand any number of Direwolf characters and characters with a
    // Direwolf attachment.
    setupCardAbilities() {
        this.action({
            title: 'Stand Direwolves',
            phase: 'challenge',
            target: {
                mode: 'unlimited',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.kneeled &&
                    (card.hasTrait('Direwolf') ||
                        card.attachments.some((attachment) => attachment.hasTrait('Direwolf')))
            },
            message: '{player} plays {source} to stand {target}',
            gameAction: GameActions.simultaneously((context) =>
                context.target.map((card) => GameActions.standCard({ card }))
            )
        });
    }
}

AtNightTheyHowl.code = '08003';

export default AtNightTheyHowl;
