const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');
const NullEvent = require('../../NullEvent.js');

class JonArryn extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCharacterKilled: event => event.card === this
            },
            cost: ability.costs.kneelFactionCard(),
            target: {
                choosingPlayer: player => player.getTotalInitiative() <= this.controller.getTotalInitiative(),
                activePromptTitle: 'Select a character',
                ifAble: true,
                cardCondition: (card, context) => card.isMatch({ kneeled: true, location: 'play area', type: 'character', trait: ['King', 'Small Council'], controller: context.choosingPlayer }),
                gameAction: 'stand'
            },
            message: {
                format: '{player} kneels their faction card and uses {source} to stand {standing} and have an additional challenges phase this round',
                args: { standing: context => {
                    let selections = context.targets.selections.filter(selection => selection.value);
                    return selections.length > 0 ? selections.map(selection => selection.value) : 'no characters';
                }}
            },
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.simultaneously(context => context.targets.selections.filter(selection => selection.value).map(selection => GameActions.standCard({ card: selection.value }))
                ),
                context);
                // This isn't ".then" as, technically with how it's worded, the "then" part of the ability should work even if no characters are chosen to stand.
                this.game.queueSimpleStep(() => {
                    this.game.addPhaseAfter('challenge', 'challenge');
                });
            }
        })
    }
}

JonArryn.code = '23001';

module.exports = JonArryn;
