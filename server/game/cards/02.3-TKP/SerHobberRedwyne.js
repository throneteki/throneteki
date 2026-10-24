import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerHobberRedwyne extends DrawCard {
    // Ser Hobber Redwyne (02043)
    // Reaction: After you marshal Ser Hobber Redwyne, search your deck for a Lady character, reveal
    // it, and add it to your hand. Shuffle your deck.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card === context.source && event.playingType === 'marshal'
            },
            message: '{player} uses {source} to search their deck for a Lady character',
            gameAction: GameActions.search({
                title: 'Select a character',
                match: {
                    type: 'character',
                    trait: 'Lady'
                },
                message: '{player} {gameAction}',
                gameAction: GameActions.addToHand((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

SerHobberRedwyne.code = '02043';

export default SerHobberRedwyne;
