import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MaesterOfSunspear extends DrawCard {
    // Maester of Sunspear (06055)
    // Reaction: After you lose a challenge in which Maester of Sunspear is participating, choose an
    // attachment and return it to its owner's hand.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    context.source.controller === event.challenge.loser &&
                    context.source.isParticipating()
            },
            target: {
                activePromptTitle: 'Select an attachment',
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'attachment'
            },
            message: "{player} uses {source} to return {target} to its owner's hand",
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.target }))
        });
    }
}

MaesterOfSunspear.code = '06055';

export default MaesterOfSunspear;
