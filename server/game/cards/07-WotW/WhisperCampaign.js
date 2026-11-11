import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class WhisperCampaign extends PlotCard {
    // Whisper Campaign (07048)
    // Forced Reaction: After a character without an [intrigue] icon enters play, kneel it.
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onCardEntersPlay: (event, context) => {
                    let card = event.card;
                    if (card.getType() !== 'character' || card.hasIcon('intrigue')) {
                        return false;
                    }

                    context.source.pendingCard = card;
                    return true;
                }
            },
            message: {
                format: '{player} is forced by {source} to kneel {pendingCard}',
                args: { pendingCard: (context) => context.source.pendingCard }
            },
            gameAction: GameActions.kneelCard((context) => ({ card: context.source.pendingCard }))
        });
    }
}

WhisperCampaign.code = '07048';

export default WhisperCampaign;
