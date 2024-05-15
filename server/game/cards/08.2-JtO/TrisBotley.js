import DrawCard from '../../drawcard.js';

class TrisBotley extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove card from game',
            limit: ability.limit.perRound(1),
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card) =>
                    card.location === 'discard pile' && card.controller !== this.controller
            },
            handler: (context) => {
                context.target.owner.moveCard(context.target, 'out of game');

                this.lastingEffect((ability) => ({
                    until: {
                        onCardLeftPlay: (event) => event.card === this
                    },
                    targetController: context.target.owner,
                    effect: [
                        ability.effects.cannotMarshal((card) => card.isCopyOf(context.target)),
                        ability.effects.cannotPlay((card) => card.isCopyOf(context.target))
                    ]
                }));

                this.game.addMessage(
                    '{0} uses {1} to remove {2} from the game',
                    this.controller,
                    this,
                    context.target
                );
                this.game.addMessage(
                    '{0} cannot marshal or play any copy of {1} until {2} leaves play',
                    context.target.owner,
                    context.target,
                    this
                );
            }
        });
    }
}

TrisBotley.code = '08031';

export default TrisBotley;
