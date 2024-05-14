const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class ATraitorsWhisper extends DrawCard {
    setupCardAbilities() {
        this.action({
            condition: (context) => context.player.discardPile.some((card) => card.isShadow()),
            target: {
                activePromptTitle: 'Select a card in each players shadow area, if able',
                cardCondition: (card) => card.location === 'shadows',
                mode: 'eachPlayer',
                gameAction: 'reveal',
                ifAble: true
            },
            message:
                '{player} plays {source} to reveal 1 card in each players shadow area, if able',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.revealCards((context) => ({
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
                    })),
                    context
                );
            }
        });
    }
}

ATraitorsWhisper.code = '23008';

module.exports = ATraitorsWhisper;
