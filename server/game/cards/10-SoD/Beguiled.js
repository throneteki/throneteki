import DrawCard from '../../drawcard.js';

class Beguiled extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove icon',
            phase: 'challenge',
            cost: ability.costs.kneelSelf(),
            handler: (context) => {
                this.game.promptForIcon(context.player, this, (icon) => {
                    this.untilEndOfPhase((ability) => ({
                        match: this.parent,
                        effect: ability.effects.removeIcon(icon)
                    }));

                    this.game.addMessage(
                        '{0} kneels {1} to remove {2} {3} icon from {4}',
                        context.player,
                        this,
                        icon === 'intrigue' ? 'an' : 'a',
                        icon,
                        this.parent
                    );
                });
            }
        });
    }
}

Beguiled.code = '10021';

export default Beguiled;
