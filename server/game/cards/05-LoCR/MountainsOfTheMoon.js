import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class MountainsOfTheMoon extends DrawCard {
    // Mountains of the Moon (05018)
    // Reaction: After a Clansman character enters play, that character gains a challenge icon of
    // your choice until the end of the phase.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    event.card.hasTrait('Clansman') && event.card.getType() === 'character'
            },
            gameAction: GameActions.chooseIcon({
                message: {
                    format: '{player} uses {source} to have {card} gain {icon} icon until the end of the phase',
                    args: { card: (context) => context.event.card }
                },
                gameAction: (icon) =>
                    GameActions.lastingEffect((context) => ({
                        duration: 'untilEndOfPhase',
                        match: context.event.card,
                        effect: ability.effects.addIcon(icon)
                    }))
            })
        });
    }
}

MountainsOfTheMoon.code = '05018';

export default MountainsOfTheMoon;
