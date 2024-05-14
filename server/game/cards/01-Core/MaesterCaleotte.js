import DrawCard from '../../drawcard.js';

class MaesterCaleotte extends DrawCard {
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
