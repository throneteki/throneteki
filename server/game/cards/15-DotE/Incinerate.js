const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class Incinerate extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Reduce STR',
            targets: {
                character: {
                    cardCondition: card => card.isMatch({ location: 'play area', type: 'character', participating: true })
                },
                toDiscard: {
                    type: 'select',
                    mode: 'unlimited',
                    activePromptTitle: 'Select cards',
                    cardCondition: (card, context) => card.isMatch({ location: 'hand' }) && card.controller === context.player
                }
            },
            handler: context => {
                const strengthReduction = -context.targets.toDiscard.length * 2;
                this.game.addMessage('{0} plays {1} to discard {2} and to give {3}\'s {4} STR', context.player, this, context.targets.toDiscard, context.targets.character, strengthReduction);
                this.game.resolveGameAction(
                    GameActions.simultaneously(context => (
                        context.targets.toDiscard.map(card => GameActions.discardCard({ card }))
                    )),
                    context
                );
                this.untilEndOfChallenge(ability => ({
                    match: context.targets.character,
                    effect: ability.effects.modifyStrength(strengthReduction)
                }));
            }
        });
    }
}

Incinerate.code = '15024';

module.exports = Incinerate;
