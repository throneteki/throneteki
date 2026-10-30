import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class TheDornishWars extends PlotCard {
    // The Dornish Wars (25108)
    // Each character an opponent controls cannot gain challenge icons.
    // Reaction: After you win a challenge, choose a character controlled by the losing opponent.
    // Until the end of the phase, that character loses a challenge icon of your choice. (Limit
    // twice per phase.)
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            match: (card) => card.getType() === 'character',
            // Note: This currently will not prevent triggered abilities which give icons from being "triggerable", but will prevent the icon from actually being gained.
            //       eg. Sea Dragon Tower will be allowed to trigger, but the character will not actually gain the icon.
            //       This is unavoidable until all "Until end of X" effects are converted to GameActions & can be checked for changing the game state.
            // Note: Even though ability does not say "by card effects", we need to ensure this is not applying when an icon lose ability unapplies.
            effect: ability.effects.cannotGainIcons(
                (context) => context.resolutionStage === 'effect'
            )
        });

        this.reaction({
            when: {
                afterChallenge: (event, context) => event.challenge.winner === context.player
            },
            target: {
                cardCondition: { type: 'character', location: 'play area' },
                gameAction: 'loseIcon'
            },
            limit: ability.limit.perPhase(2),
            gameAction: GameActions.chooseIcon({
                message:
                    '{player} uses {source} to have {target} lose {icon} icon until the end of the phase',
                gameAction: (icon) =>
                    GameActions.lastingEffect((context) => ({
                        duration: 'untilEndOfPhase',
                        match: context.target,
                        effect: ability.effects.removeIcon(icon)
                    }))
            })
        });
    }
}

TheDornishWars.code = '25108';

export default TheDornishWars;
