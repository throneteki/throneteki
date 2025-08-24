import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerGulianQorgyle extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDeclaredAsAttacker: (event) => event.card.controller !== this.controller,
                onDeclaredAsDefender: (event) => event.card.controller !== this.controller
            },
            limit: ability.limit.perPhase(2),
            message: {
                format: '{player} uses {source} to have {character} lose an icon of their choice until the end of the phase',
                args: { character: (context) => context.event.card }
            },
            gameAction: GameActions.genericHandler((context) => {
                this.game.promptForIcon(this.controller, this, (icon) => {
                    this.untilEndOfPhase((ability) => ({
                        match: context.event.card,
                        effect: ability.effects.removeIcon(icon)
                    }));

                    this.game.addMessage(
                        '{0} chooses to have {1} lose {2} {3} icon until the end of the phase',
                        this.controller,
                        context.event.card,
                        icon === 'intrigue' ? 'an' : 'a',
                        icon
                    );
                });
            })
        });
    }
}

SerGulianQorgyle.code = '26049';

export default SerGulianQorgyle;
