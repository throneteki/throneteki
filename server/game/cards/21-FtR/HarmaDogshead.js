import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class HarmaDogshead extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDiscarded: (event, context) =>
                    event.isPillage &&
                    event.source.controller === context.player &&
                    event.source.hasTrait('Wildling')
            },
            limit: ability.limit.perPhase(2),
            message:
                '{player} uses {source} to search the top 10 cards of their deck for an Item or Weapon attachment with printed cost 2 or lower',
            gameAction: GameActions.search({
                title: 'Select an attachment',
                match: { type: 'attachment', trait: ['Item', 'Weapon'], printedCostOrLower: 2 },
                topCards: 10,
                reveal: false,
                message: '{player} {gameAction}',
                gameAction: GameActions.putIntoPlay((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

HarmaDogshead.code = '21025';

export default HarmaDogshead;
