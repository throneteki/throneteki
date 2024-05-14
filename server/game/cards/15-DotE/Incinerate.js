const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class Incinerate extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Reduce STR',
            condition: (context) =>
                context.player.hand.filter((card) => card !== context.source).length > 0,
            target: {
                cardCondition: { location: 'play area', type: 'character', participating: true }
            },
            message: '{player} plays {source} to reduce the STR of {target}',
            handler: (context) => {
                this.game.promptForSelect(context.player, {
                    type: 'select',
                    mode: 'unlimited',
                    activePromptTitle: 'Select cards',
                    source: context.source,
                    context: context,
                    cardCondition: (card, context) =>
                        card.isMatch({ location: 'hand' }) && card.controller === context.player,
                    onSelect: (player, toDiscard) => {
                        const strengthReduction = -toDiscard.length * 2;
                        this.game.addMessage(
                            "{0} discards {1} to give {2}'s {3} STR",
                            context.player,
                            toDiscard,
                            context.target,
                            strengthReduction
                        );
                        this.game.resolveGameAction(
                            GameActions.simultaneously(
                                toDiscard.map((card) => GameActions.discardCard({ card }))
                            ),
                            context
                        );
                        this.untilEndOfChallenge((ability) => ({
                            match: context.target,
                            effect: ability.effects.modifyStrength(strengthReduction)
                        }));
                        return true;
                    }
                });
            }
        });
    }
}

Incinerate.code = '15024';

module.exports = Incinerate;
