import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DeepwoodMotte extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({ initiative: -2 });
        this.reaction({
            when: {
                onCardKneeled: (event) =>
                    event.reason === 'assault' &&
                    event.card.getType() === 'location' &&
                    this.game.isDuringChallenge({ attackingPlayer: this.controller })
            },
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    ((card.hasTrait('Raider') && card.controller === this.controller) ||
                        card.name === 'Asha Greyjoy')
            },
            message: '{player} kneels {costs.kneel} to stand {target}',
            gameAction: GameActions.standCard((context) => ({ card: context.target }))
        });
    }
}

DeepwoodMotte.code = '27024';

export default DeepwoodMotte;
