import DrawCard from '../../drawcard.js';

class MaesterMyles extends DrawCard {
    // Maester Myles (11095)
    // Challenges Action: Kneel Maester Myles to choose a character with printed cost equal to or
    // lower than the number of plot cards in your used pile. Until the end of the phase, that
    // character loses a challenge icon of your choice.
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove icon',
            phase: 'challenge',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getPrintedCost() <= this.controller.getNumberOfUsedPlots()
            },
            handler: (context) => {
                this.game.promptForIcon(context.player, this, (icon) => {
                    this.game.addMessage(
                        '{0} kneels {1} to remove {2} {3} icon from {4} until the end of the phase',
                        context.player,
                        this,
                        icon === 'intrigue' ? 'an' : 'a',
                        icon,
                        context.target
                    );
                    this.untilEndOfPhase((ability) => ({
                        match: context.target,
                        effect: ability.effects.removeIcon(icon)
                    }));
                });
            }
        });
    }
}

MaesterMyles.code = '11095';

export default MaesterMyles;
