import DrawCard from '../../drawcard.js';

class JoffreyBaratheon extends DrawCard {
    // Joffrey Baratheon (04089)
    // Reaction: After you marshal a loyal character, kneel that character and your faction card to
    // choose and kill a non-King character with a lower printed cost.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    this.controller === event.card.controller &&
                    event.playingType === 'marshal' &&
                    event.card.getType() === 'character' &&
                    event.card.isLoyal()
            },
            cost: [
                ability.costs.kneelSpecific((context) => context.event.card),
                ability.costs.kneelFactionCard()
            ],
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    !card.hasTrait('King') &&
                    card.getType() === 'character' &&
                    card.getPrintedCost() < context.event.card.getPrintedCost(),
                gameAction: 'kill'
            },
            handler: (context) => {
                this.game.killCharacter(context.target);
                this.game.addMessage(
                    '{0} uses {1}, kneels their faction card and kneels {2} to kill {3}',
                    this.controller,
                    this,
                    context.event.card,
                    context.target
                );
            }
        });
    }
}

JoffreyBaratheon.code = '04089';

export default JoffreyBaratheon;
