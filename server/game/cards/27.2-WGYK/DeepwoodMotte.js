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
                type: 'select',
                activePromptTitle: 'Select a character to stand',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.kneeled &&
                    card.getType() === 'character' &&
                    ((card.hasTrait('Raider') && card.controller === this.controller) ||
                        card.name === 'Asha Greyjoy'),
                gameAction: 'stand'
            },
            message: '{player} uses {source} to stand {target}',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.standCard((context) => ({ card: context.target })),
                    context
                );
            }
        });
    }
}

DeepwoodMotte.code = '27024';

export default DeepwoodMotte;
