import DrawCard from '../../drawcard.js';

class Pyromancers extends DrawCard {
    // Pyromancers (04018)
    // Dominance Action: Kneel Pyromancers and discard 1 power from your faction card to choose a
    // non-limited location, and discard it from play.
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard a location',
            phase: 'dominance',
            cost: [ability.costs.kneelSelf(), ability.costs.discardFactionPower(1)],
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    !card.isLimited() &&
                    card.getType() === 'location',
                gameAction: 'discard'
            },
            handler: (context) => {
                context.target.controller.discardCard(context.target);
                this.game.addMessage(
                    '{0} kneels {1} and discards a power from their faction to discard {2} from play',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

Pyromancers.code = '04018';

export default Pyromancers;
