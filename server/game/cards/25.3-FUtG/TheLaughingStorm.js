import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class TheLaughingStorm extends DrawCard {
    // The Laughing Storm (25042)
    // Unique [baratheon] location you control only.
    // While The Laughing Storm is standing, cards cannot be discarded at random from your hand.
    // Reaction: After you win a challenge, kneel The Laughing Storm to choose and kneel a character
    // controlled by the losing opponent.
    setupCardAbilities(ability) {
        this.attachmentRestriction({
            type: 'location',
            faction: 'baratheon',
            controller: 'current',
            unique: true
        });
        this.persistentEffect({
            condition: () => !this.kneeled,
            targetLocation: 'hand',
            effect: ability.effects.cannotBeDiscardedAtRandom()
        });

        this.reaction({
            when: {
                afterChallenge: (event) => event.challenge.winner === this.controller
            },
            target: {
                cardCondition: (card, context) =>
                    card.isMatch({
                        location: 'play area',
                        type: 'character',
                        controller: context.event.challenge.loser
                    }) && GameActions.kneelCard({ card }).allow()
            },
            cost: ability.costs.kneelSelf(),
            message: '{player} kneels {source} to kneel {target}',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.kneelCard((context) => ({ card: context.target })),
                    context
                );
            }
        });
    }
}

TheLaughingStorm.code = '25042';

export default TheLaughingStorm;
