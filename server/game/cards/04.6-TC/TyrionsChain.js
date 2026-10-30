import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class TyrionsChain extends DrawCard {
    // Tyrion's Chain (04110)
    // Reaction: After you win a challenge in which you control a participating unique [lannister]
    // character, choose a revealed War plot card. Initiate the when revealed ability on that plot
    // card as if you had just revealed it. (Max 1 per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    context.player.anyCardsInPlay(
                        (card) =>
                            card.isParticipating() &&
                            card.isUnique() &&
                            card.isFaction('lannister') &&
                            card.getType() === 'character'
                    )
            },
            max: ability.limit.perPhase(1),
            target: {
                activePromptTitle: 'Select a plot',
                cardCondition: (card) =>
                    card.location === 'active plot' &&
                    card.hasTrait('War') &&
                    !!card.getWhenRevealedAbility(),
                cardType: 'plot'
            },
            message: '{player} plays {source} to initiate the When Revealed ability of {target}',
            gameAction: GameActions.initiateWhenRevealed((context) => ({ plot: context.target }))
        });
    }
}

TyrionsChain.code = '04110';

export default TyrionsChain;
