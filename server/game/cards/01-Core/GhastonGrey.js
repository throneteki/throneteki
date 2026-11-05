import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GhastonGrey extends DrawCard {
    // Ghaston Grey (01116)
    // Reaction: After you lose a challenge as the defending player, kneel and sacrifice Ghaston
    // Grey to return an attacking character to its owner's hand (cannot be saved).
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.loser === context.source.controller &&
                    event.challenge.defendingPlayer === context.source.controller
            },
            cost: [ability.costs.kneelSelf(), ability.costs.sacrificeSelf()],
            target: {
                type: 'select',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isAttacking()
            },
            message: {
                format: "{player} kneels and sacrifices {source} to return {target} to {owner}'s hand",
                args: { owner: (context) => context.target.owner }
            },
            gameAction: GameActions.returnCardToHand((context) => ({
                card: context.target,
                allowSave: false
            }))
        });
    }
}

GhastonGrey.code = '01116';

export default GhastonGrey;
