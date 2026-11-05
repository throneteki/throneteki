import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class StreetOfSteel extends DrawCard {
    // Street of Steel (02097)
    // Reaction: After you win a [military] challenge, kneel your faction card to search the top 10
    // cards of your deck for a Weapon or Item attachment, reveal it, and add it to your hand.
    // Shuffle your deck.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    event.challenge.challengeType === 'military'
            },
            cost: ability.costs.kneelFactionCard(),
            message:
                '{player} uses {source} and kneels their faction card to search the top 10 cards of their deck for a Weapon or Item attachment',
            gameAction: GameActions.search({
                topCards: 10,
                title: 'Select an attachment',
                match: {
                    type: 'attachment',
                    trait: ['Weapon', 'Item']
                },
                message: '{player} {gameAction}',
                gameAction: GameActions.addToHand((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

StreetOfSteel.code = '02097';

export default StreetOfSteel;
