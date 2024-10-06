import PlotCard from '../../plotcard.js';

class TheDornishWars extends PlotCard {
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
                afterChallenge: (event) => event.challenge.winner === this.controller
            },
            target: {
                cardCondition: { type: 'character', location: 'play area' },
                gameAction: 'loseIcon'
            },
            limit: ability.limit.perPhase(2),
            handler: (context) => {
                this.game.promptForIcon(context.player, this, (icon) => {
                    this.untilEndOfPhase((ability) => ({
                        match: context.target,
                        effect: ability.effects.removeIcon(icon)
                    }));

                    this.game.addMessage(
                        '{0} uses {1} to have {2} lose {4} {5} icon until the end of the phase',
                        context.player,
                        this,
                        context.target,
                        icon === 'intrigue' ? 'an' : 'a',
                        icon
                    );
                });
                return true;
            }
        });
    }
}

TheDornishWars.code = '25108';

export default TheDornishWars;
