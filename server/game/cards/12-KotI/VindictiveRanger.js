import DrawCard from '../../drawcard.js';

class VindictiveRanger extends DrawCard {
    // Vindictive Ranger (12031)
    // Reaction: After you lose a challenge as the defending player, Vindictive Ranger gains stealth
    // and a challenge icon of your choice until the end of the phase.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.isMatch({
                        loser: this.controller,
                        defendingPlayer: this.controller
                    })
            },
            handler: (context) => {
                this.game.promptForIcon(context.player, this, (icon) => {
                    this.game.addMessage(
                        '{0} uses {1} to gain stealth and {2} {3} icon',
                        context.player,
                        this,
                        icon === 'intrigue' ? 'an' : 'a',
                        icon
                    );
                    this.untilEndOfPhase((ability) => ({
                        match: this,
                        effect: [
                            ability.effects.addIcon(icon),
                            ability.effects.addKeyword('Stealth')
                        ]
                    }));
                });
            }
        });
    }
}

VindictiveRanger.code = '12031';

export default VindictiveRanger;
