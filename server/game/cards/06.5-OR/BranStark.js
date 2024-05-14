import DrawCard from '../../drawcard.js';

class BranStark extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand and give Direwolf icon',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.hasTrait('Direwolf') &&
                    card.getType() === 'character'
            },
            handler: (context) => {
                this.game.promptForIcon(this.controller, this, (icon) => {
                    context.target.controller.standCard(context.target);

                    this.untilEndOfPhase((ability) => ({
                        match: context.target,
                        effect: ability.effects.addIcon(icon)
                    }));

                    this.game.addMessage(
                        '{0} kneels {1} to stand and give {2} {3} icon to {4} until the end of the phase',
                        this.controller,
                        this,
                        icon === 'intrigue' ? 'an' : 'a',
                        icon,
                        context.target
                    );
                });
            }
        });
    }
}

BranStark.code = '06081';

export default BranStark;
