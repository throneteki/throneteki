import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class IronVictorysCrew extends DrawCard {
    // Iron Victory's Crew (11091)
    // No attachments.
    // Reaction: After Iron Victory's Crew enters play, search your deck for a Warship location,
    // reveal it, and add it to your hand (put it into play instead if it is Iron Victory). Shuffle
    // your deck.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            message: '{player} uses {source} to search their deck for a Warship location',
            gameAction: GameActions.search({
                title: 'Select a location',
                match: { type: 'location', trait: 'Warship' },
                message: '{player} {gameAction}',
                gameAction: GameActions.ifCondition({
                    condition: (context) => context.searchTarget.name === 'Iron Victory',
                    thenAction: GameActions.putIntoPlay((context) => ({
                        card: context.searchTarget
                    })),
                    elseAction: GameActions.addToHand((context) => ({
                        card: context.searchTarget
                    }))
                })
            })
        });
    }
}

IronVictorysCrew.code = '11091';

export default IronVictorysCrew;
