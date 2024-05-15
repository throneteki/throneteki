import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class OurWordIsGoodAsGold extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Search deck for Mercenary',
            gameAction: GameActions.search({
                title: 'Select a character',
                match: { type: 'character', trait: 'Mercenary' },
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
                        effect: ability.effects.returnToHandIfStillInPlay(true)
                    }));
                })
            })
        });
    }
}

OurWordIsGoodAsGold.code = '20033';

export default OurWordIsGoodAsGold;
