import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ATraitorsWhisper extends DrawCard {
    // A Traitor's Whisper (23008)
    // Play only if there is a card with shadow in your discard pile.
    // Action: Choose and reveal a card from each player's shadows area, if able. You may put those
    // cards into play.
    setupCardAbilities() {
        this.action({
            condition: (context) => context.player.discardPile.some((card) => card.isShadow()),
            targets: {
                shadowCards: {
                    activePromptTitle: 'Select a card in each players shadow area, if able',
                    cardCondition: (card) => card.location === 'shadows',
                    mode: 'eachPlayer',
                    gameAction: 'reveal',
                    ifAble: true
                }
            },
            message:
                '{player} plays {source} to reveal 1 card in each players shadow area, if able',
            gameAction: GameActions.revealCards((context) => ({
                cards: context.targets.getTargets(),
                whileRevealed: GameActions.may({
                    title: 'Put revealed cards into play?',
                    message: {
                        format: '{player} puts {revealed} into play from shadows',
                        args: { revealed: (context) => context.revealed }
                    },
                    gameAction: GameActions.simultaneously((context) =>
                        context.revealed.map((card) => GameActions.putIntoPlay({ card }))
                    )
                })
            }))
        });
    }
}

ATraitorsWhisper.code = '23008';

export default ATraitorsWhisper;
