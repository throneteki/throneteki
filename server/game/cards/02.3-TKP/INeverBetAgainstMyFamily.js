const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class INeverBetAgainstMyFamily extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put character in play from bottom of your deck',
            phase: 'challenge',
            cost: ability.costs.kneelFactionCard(),
            message:
                '{player} plays {source} and kneels their faction card to reveal the bottom 5 cards of their deck',
            gameAction: GameActions.revealCards((context) => ({
                cards: context.player.searchDrawDeck(-5),
                player: context.player,
                whileRevealed: GameActions.genericHandler((context) => {
                    const isUniqueLannister = (card) =>
                        card.isMatch({ type: 'character', unique: true, faction: 'lannister' });
                    if (context.revealed.some(isUniqueLannister)) {
                        this.game.promptForSelect(context.player, {
                            activePromptTitle: 'Select a character',
                            cardCondition: (card) =>
                                context.revealed.includes(card) && isUniqueLannister(card),
                            onSelect: (player, card) => {
                                context.target = card;
                                this.handleCards(context);
                                return true;
                            },
                            onCancel: () => {
                                this.handleCards(context);
                                return true;
                            }
                        });
                    }
                })
            }))
        });
    }

    handleCards(context) {
        if (context.target) {
            this.game.addMessage('{0} puts {1} into play', context.player, context.target);
        }
        const placedOnBottom = context.revealed.filter((card) => card !== context.target);
        if (placedOnBottom.length > 0) {
            this.game.addMessage(
                '{0} places {1} on the bottom of their deck',
                context.player,
                placedOnBottom
            );
        }
        this.game.resolveGameAction(
            GameActions.simultaneously((context) =>
                context.revealed.map((card) =>
                    card === context.target
                        ? this.buildPutIntoPlayAction(card)
                        : GameActions.placeCard({ card, location: 'draw deck', bottom: true })
                )
            ),
            context
        );
    }

    buildPutIntoPlayAction(card) {
        return GameActions.putIntoPlay({ card }).then({
            handler: () => {
                this.atEndOfPhase((ability) => ({
                    match: card,
                    condition: () => ['play area', 'duplicate'].includes(card.location),
                    targetLocation: 'any',
                    effect: ability.effects.discardIfStillInPlay(false)
                }));
            }
        });
    }
}

INeverBetAgainstMyFamily.code = '02050';

module.exports = INeverBetAgainstMyFamily;
