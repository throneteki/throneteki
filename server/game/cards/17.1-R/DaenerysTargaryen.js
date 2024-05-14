const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class DaenerysTargaryen extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search deck',
            cost: ability.costs.kneelFactionCard(),
            message:
                '{player} uses {source} to search the top 10 cards of their deck for a Dragon or Title card',
            gameAction: GameActions.search({
                title: 'Select a card',
                match: { trait: ['Dragon', 'Title'] },
                topCards: 10,
                reveal: false,
                message: '{player} {gameAction}',
                gameAction: GameActions.putIntoPlay((context) => ({
                    card: context.searchTarget
                })).thenExecute((event) => {
                    this.atEndOfPhase((ability) => ({
                        match: event.card,
                        condition: () => ['play area', 'duplicate'].includes(event.card.location),
                        targetLocation: 'any',
                        effect: ability.effects.returnToHandIfStillInPlayAndNotAttachedToCardByTitle(
                            'Daenerys Targaryen',
                            false
                        )
                    }));
                })
            })
        });
    }
}

DaenerysTargaryen.code = '17128';

module.exports = DaenerysTargaryen;
