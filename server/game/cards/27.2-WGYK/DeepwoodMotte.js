import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DeepwoodMotte extends DrawCard {
    // Deepwood Motte (27024)
    // Reaction: After a location is knelt by assault during a challenge in which you are the
    // attacking player, kneel Deepwood Motte to choose and stand a Raider character you control or
    // Asha Greyjoy.
    // -2 Initiative.
    setupCardAbilities(ability) {
        this.plotModifiers({ initiative: -2 });
        this.reaction({
            when: {
                onCardKneeled: (event, context) =>
                    event.reason === 'assault' &&
                    event.card.getType() === 'location' &&
                    context.game.isDuringChallenge({ attackingPlayer: context.player })
            },
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    ((card.hasTrait('Raider') && card.controller === context.player) ||
                        card.name === 'Asha Greyjoy')
            },
            message: '{player} kneels {costs.kneel} to stand {target}',
            gameAction: GameActions.standCard((context) => ({ card: context.target }))
        });
    }
}

DeepwoodMotte.code = '27024';

export default DeepwoodMotte;
