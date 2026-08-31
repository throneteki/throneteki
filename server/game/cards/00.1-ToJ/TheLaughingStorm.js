import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheLaughingStorm extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({
            type: 'location',
            controller: 'current',
            limited: false
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

TheLaughingStorm.code = '00107';

export default TheLaughingStorm;
