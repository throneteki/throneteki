import DrawCard from '../../drawcard.js';

class Starfall extends DrawCard {
    // Starfall (10018)
    // Challenges Action: Kneel Starfall to choose a character. Until the end of the phase, that
    // character loses a challenge icon of your choice.
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove icon',
            phase: 'challenge',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            handler: (context) => {
                this.game.promptForIcon(context.player, this, (icon) => {
                    this.untilEndOfPhase((ability) => ({
                        match: context.target,
                        effect: ability.effects.removeIcon(icon)
                    }));

                    this.game.addMessage(
                        '{0} kneels {1} to remove {2} {3} icon from {4}',
                        context.player,
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

Starfall.code = '10018';

export default Starfall;
