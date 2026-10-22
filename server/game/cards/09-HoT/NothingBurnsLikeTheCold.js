import PlotCard from '../../plotcard.js';
import Messages from '../../Messages/index.js';
import GameActions from '../../GameActions/index.js';

class NothingBurnsLikeTheCold extends PlotCard {
    // Nothing Burns Like The Cold (09052)
    // When Revealed: Each player chooses an attachment and a non-limited location he or she
    // controls, if able, and discards each of those cards from play (cannot be saved).
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                choosingPlayer: 'each',
                subTargets: {
                    attachment: {
                        ifAble: true,
                        activePromptTitle: 'Select an attachment',
                        cardCondition: (card, context) =>
                            card.location === 'play area' &&
                            card.controller === context.choosingPlayer &&
                            card.getType() === 'attachment',
                        gameAction: 'discard'
                    },
                    location: {
                        ifAble: true,
                        activePromptTitle: 'Select a location',
                        cardCondition: (card, context) =>
                            card.location === 'play area' &&
                            card.controller === context.choosingPlayer &&
                            card.getType() === 'location' &&
                            !card.isLimited(),
                        gameAction: 'discard'
                    }
                },
                messages: Messages.eachPlayerTargeting
            },
            gameAction: GameActions.simultaneously((context) =>
                context.targets
                    .getTargets()
                    .map((card) => GameActions.discardCard({ card, allowSave: false }))
            )
        });
    }
}

NothingBurnsLikeTheCold.code = '09052';

export default NothingBurnsLikeTheCold;
