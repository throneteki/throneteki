import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class StormsEnd extends DrawCard {
    // Storm's End (06008)
    // Reaction: After you win dominance, discard 1 power from your faction card to choose 2
    // characters. Each of those characters gains 1 power.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDominanceDetermined: (event, context) =>
                    context.source.controller === event.winner
            },
            cost: ability.costs.discardFactionPower(1),
            target: {
                activePromptTitle: 'Select 2 characters',
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character',
                numCards: 2,
                multiSelect: true,
                gameAction: 'gainPower'
            },
            message:
                '{player} uses {source} and discards 1 power from their faction card to have {target} gain 1 power',
            gameAction: GameActions.simultaneously((context) =>
                context.target.map((card) => GameActions.gainPower({ card, amount: 1 }))
            )
        });
    }
}

StormsEnd.code = '06008';

export default StormsEnd;
