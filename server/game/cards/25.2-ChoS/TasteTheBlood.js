import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';
import { Flags } from '../../Constants/index.js';

class TasteTheBlood extends DrawCard {
    // Taste the Blood (25032)
    // Reaction: After you win an [intrigue] challenge in which you control a participating Old Gods
    // character, kneel your faction card to choose a plot card in any player's used pile. Initiate
    // the when revealed ability on that card as if you had just revealed it.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    event.challenge.challengeType === 'intrigue' &&
                    context.player.anyCardsInPlay(
                        (card) =>
                            card.getType() === 'character' &&
                            card.hasTrait('Old Gods') &&
                            card.isParticipating()
                    )
            },
            target: {
                activePromptTitle: 'Select a plot',
                cardCondition: (card) =>
                    card.location === 'revealed plots' &&
                    !card.hasFlag(Flags.card.notConsideredToBeInPlotDeck) &&
                    !!card.getWhenRevealedAbility(),
                cardType: 'plot'
            },
            cost: ability.costs.kneelFactionCard(),
            message:
                '{player} kneels their faction card and plays {source} to initiate the when revealed ability of {target}',
            gameAction: GameActions.initiateWhenRevealed((context) => ({ plot: context.target }))
        });
    }
}

TasteTheBlood.code = '25032';

export default TasteTheBlood;
