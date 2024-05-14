import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AegonTargaryen extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            message:
                '{player} uses {source} to search their deck for an Army or Mercenary character',
            gameAction: GameActions.search({
                title: 'Select a character',
                match: { type: 'character', trait: ['Army', 'Mercenary'] },
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

AegonTargaryen.code = '11014';

export default AegonTargaryen;
