import DrawCard from '../../drawcard.js';

class MaesterCaleotte extends DrawCard {
    // Maester Caleotte (01107)
    // Reaction: After you lose a challenge in which Maester Caleotte is participating, choose a
    // character. That character loses a challenge icon of your choice until the end of the phase.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.loser === this.controller && this.isParticipating()
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            handler: (context) => {
                this.game.promptForIcon(this.controller, this, (icon) => {
                    this.untilEndOfPhase((ability) => ({
                        match: context.target,
                        effect: ability.effects.removeIcon(icon)
                    }));
                    this.game.addMessage(
                        '{0} uses {1} to remove {2} {3} icon from {4}',
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

MaesterCaleotte.code = '01107';

export default MaesterCaleotte;
