import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DrownedProphet extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCharacterKilled: (event) => event.card === this
            },
            limit: ability.limit.perPhase(1),
            message:
                '{player} uses {source} to search the top 5 cards of their deck for a Greyjoy character',
            gameAction: GameActions.search({
                title: 'Select a character',
                topCards: 5,
                match: { type: 'character', faction: 'greyjoy' },
                reveal: false,
                message: '{player} places {searchTarget} in their dead pile',
                gameAction: GameActions.placeCard((context) => ({
                    card: context.searchTarget,
                    player: context.player,
                    location: 'dead pile'
                }))
            })
        });
    }
}

DrownedProphet.code = '12013';

export default DrownedProphet;
