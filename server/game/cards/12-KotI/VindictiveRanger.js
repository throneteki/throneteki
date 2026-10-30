import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class VindictiveRanger extends DrawCard {
    // Vindictive Ranger (12031)
    // Reaction: After you lose a challenge as the defending player, Vindictive Ranger gains stealth
    // and a challenge icon of your choice until the end of the phase.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.isMatch({
                        loser: context.source.controller,
                        defendingPlayer: context.source.controller
                    })
            },
            gameAction: GameActions.chooseIcon({
                message: '{player} uses {source} to gain stealth and {icon} icon',
                gameAction: (icon) =>
                    GameActions.lastingEffect((context) => ({
                        duration: 'untilEndOfPhase',
                        match: context.source,
                        effect: [
                            ability.effects.addIcon(icon),
                            ability.effects.addKeyword('Stealth')
                        ]
                    }))
            })
        });
    }
}

VindictiveRanger.code = '12031';

export default VindictiveRanger;
