import DrawCard from '../../drawcard.js';

class QuietAsAShadow extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Give character stealth',
            target: {
                cardCondition: (card) =>
                    card.isUnique() &&
                    card.getType() === 'character' &&
                    card.getPrintedCost() <= 3 &&
                    card.location === 'play area'
            },
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.addKeyword('stealth')
                }));
                this.game.addMessage(
                    '{0} plays {1} to give {2} stealth until the end of the phase',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

QuietAsAShadow.code = '04099';

export default QuietAsAShadow;
