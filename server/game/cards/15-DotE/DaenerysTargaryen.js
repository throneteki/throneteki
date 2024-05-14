import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DaenerysTargaryen extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search deck',
            limit: ability.limit.perRound(1),
            message:
                '{player} uses {source} to search the top 10 cards of their deck for an attachment or Dragon card',
            gameAction: GameActions.search({
                title: 'Select a card',
                topCards: 10,
                match: { or: [{ type: 'attachment' }, { trait: 'Dragon' }] },
                gameAction: GameActions.ifCondition({
                    condition: (context) =>
                        context.searchTarget.getPrintedCost() > 3 ||
                        !this.controller.canPutIntoPlay(context.searchTarget),
                    thenAction: {
                        message: '{player} {gameAction}',
                        gameAction: GameActions.addToHand((context) => ({
                            card: context.searchTarget
                        }))
                    },
                    elseAction: GameActions.choose({
                        title: 'Put card into play?',
                        message: '{player} {gameAction}',
                        choices: {
                            'Add to hand': GameActions.addToHand((context) => ({
                                card: context.searchTarget
                            })),
                            'Put in play': GameActions.putIntoPlay((context) => ({
                                card: context.searchTarget
                            }))
                        }
                    })
                })
            })
        });
    }
}

DaenerysTargaryen.code = '15001';

export default DaenerysTargaryen;
