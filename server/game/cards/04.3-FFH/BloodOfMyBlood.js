import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BloodOfMyBlood extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Search deck for Bloodrider',
            phase: 'challenge',
            message: '{player} plays {source} to search their deck for a Bloodrider character',
            gameAction: GameActions.search({
                title: 'Select a character',
                match: { type: 'character', trait: 'Bloodrider' },
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

BloodOfMyBlood.code = '04054';

export default BloodOfMyBlood;
