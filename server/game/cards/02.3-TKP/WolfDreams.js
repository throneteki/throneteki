const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class WolfDreams extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search for a Direwolf',
            cost: ability.costs.kneelFactionCard(),
            message:
                '{player} plays {source} and kneels their faction card to search their deck for a Direwolf card',
            gameAction: GameActions.search({
                title: 'Select a card',
                match: { trait: 'Direwolf' },
                message: '{player} {gameAction}',
                gameAction: GameActions.addToHand((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

WolfDreams.code = '02042';

module.exports = WolfDreams;
